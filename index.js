const {connection, config} = require("metamui-sdk");
const balance = require("./src/balance");
const did = require("./src/did");
const vc = require("./src/vc");
const fs = require('fs');
const {insertStorage} = require('./src/helper');

async function main() {
    let state = JSON.parse(fs.readFileSync('../store-decode/data/state.json'));
    
    let balanceStore = balance.generateBalances(state.balanceStore);
    console.log("Balances Store");
    console.log(balanceStore);
    
    let didStore = did.generatedDids(state.didStore);
    console.log("Did Store");
    console.log(didStore);
    
    let vcStore = vc.generateVCs(state.vcStore);
    console.log("VC Store");
    console.log(vcStore);
    
    let api = await connection.buildConnectionByUrl('ws://localhost:9944');

    let finalData = {...balanceStore, ...didStore, ...vcStore};

    let keyring = await config.initKeyring();
    // Root Key pair
    let sigKeypair = keyring.addFromUri('//Alice');

    await insertStorage(Object.entries(finalData), sigKeypair, api);

    console.log("Updated")

    fs.writeFileSync('data/newFork.json', JSON.stringify(finalData));
}

main();