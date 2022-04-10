const { SmartContract, SmartContractAbi, mongoose } = require("../db");

let contracts = (async () => {
    let contract = {}
    let _contract = await SmartContract.find();
    _contract.forEach(item => contract[item.name] = item);
    let abi = {}
    let _abi = await SmartContractAbi.find();
    _abi.forEach(item => abi[item.name] = item.abi)
    console.log("{INFO] Set contracts");
    return {
        contract,
        abi,
    }
})()

module.exports = async (ctx, next) => {
    ctx.session.contracts = await contracts;
    return next();
}