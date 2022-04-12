const fs = require('fs');
const path = require('path');
const { SmartContract, SmartContractAbi, mongoose } = require("../db");

const web3 = require("../web3");

module.exports = async (contractsDirPath, abiDirPath) => {
    try {
        mongoose.connection.on("open", () => {
            console.log("[INFO] Initialize base DB objects");
        });

        if (!contractsDirPath || !abiDirPath ||
            !fs.existsSync(contractsDirPath) ||
            !fs.existsSync(abiDirPath)) {
            console.log("[WARN] Can`t load smart contracts from dirs.");
            return false;
        }

        const abiFiles = fs.readdirSync(abiDirPath);
        const contractFiles = fs.readdirSync(contractsDirPath);

        for (i = 0; i < abiFiles.length; i++) {
            if (path.extname(abiFiles[i]) == ".json") {
                const abiName = path.basename(abiDirPath + "/" + abiFiles[i], ".json");
                const abiData = fs.readFileSync(abiDirPath + "/" + abiFiles[i]);
                if (!(await SmartContractAbi.findOne({ name: abiName })))
                    await SmartContractAbi.create({
                        name: abiName,
                        abi: abiData,
                    });

            }
        }


        for (i = 0; i < contractFiles.length; i++) {
            if (path.extname(contractFiles[i]) == ".json") {

                const contractData = JSON.parse(fs.readFileSync(contractsDirPath + "/" + contractFiles[i]));

                if (contractData.address && contractData.type) {

                    if (!contractData.abi || !(await SmartContractAbi.findOne({ name: contractData.abi })))
                        contractData.abi = contractData.type + "_default";


                    if (!contractData.name || !contractData.symbol) {
                        const contract = await new web3.eth.Contract(
                            JSON.parse((await SmartContractAbi.findOne({name: contractData.abi})).abi),
                            contractData.address,
                        );
                        contractData.name = contractData.name
                            ? contractData.name
                            : await contract.methods.name().call();

                        contractData.symbol = contractData.symbol
                            ? contractData.symbol
                            : await contract.methods.symbol().call();
                    }

                    if (!(await SmartContract.findOne({ name: contractData.name })))
                        await SmartContract.create({ ...contractData });

                } else {
                    console.log("[WARN] initSmartContracts. File " + contractFiles[i] + " is invalid.")
                }
            }
        }
    } catch (e) {
        console.log("[ERROR] initSmartContracts. \n" + e);
    }
}