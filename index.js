const {connection, config} = require("metamui-sdk");
const balance = require("./src/balance");
const did = require("./src/did");
const vc = require("./src/vc");
const council = require("./src/council");
const validator_set = require("./src/validator_set");
const fs = require('fs');
const {insertStorage} = require('./src/helper');

async function generateRelaySpec() {
    let state = JSON.parse(fs.readFileSync('../store-decode/data/state.json'));
    
    let balanceStore = balance.generateBalances(state.balanceStore);
    console.log("Balances Store Updated");
    
    let didStore = did.generatedDids(state.didStore);
    console.log("Did Store Updated");
    
    let vcStore = vc.generateVCs(state.vcStore);
    console.log("VC Store Updated");
    
    let councilStore = council.generateCouncil(state.councilStore);
    console.log("Council Store Updated");
    
    let validatorSetStore = validator_set.generateValidatorSet(state.validatorSetStore);
    console.log("Validator Set Store Updated");
    
    let finalData = {...balanceStore, ...didStore, ...vcStore, ...councilStore, ...validatorSetStore};


    let api = await connection.buildConnectionByUrl('ws://localhost:9944');

    let keyring = await config.initKeyring();

    // Root Key pair
    let sigKeypair = keyring.addFromUri('//Alice');

    // Updates generated fork to running chain
    await insertStorage(Object.entries(finalData), sigKeypair, api);

    console.log("Updated");


    let specRaw = JSON.parse(fs.readFileSync('../metamui-core/chainspecs/chainSpecRaw.json'));

    for (const [key, value] of Object.entries(finalData)) {
        specRaw.genesis.raw.top[key] = value;
    }

    fs.writeFileSync('data/relayFork.json', JSON.stringify(finalData));
    fs.writeFileSync('data/updatedSpecRaw.json', JSON.stringify(specRaw));
}

function main() {
    generateRelaySpec()
}

main();