const {connection, config} = require("metamui-sdk");
const balance = require("./src/balance");
const did = require("./src/did");
const vc = require("./src/vc");
const token = require("./src/token");
const council = require("./src/council");
const validator_set = require("./src/validator_set");
const fs = require('fs');

const {insertStorage} = require('./src/helper');
const { stringToHex } = require("@polkadot/util");

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


    // let api = await connection.buildConnectionByUrl('ws://localhost:9944');

    // let keyring = await config.initKeyring();

    // // Root Key pair
    // let sigKeypair = keyring.addFromUri('//Alice');

    // // Updates generated fork to running chain
    // await insertStorage(Object.entries(finalData), sigKeypair, api);

    // console.log("Updated");


    // let specRaw = JSON.parse(fs.readFileSync('../metamui-core/chainspecs/chainSpecRaw.json'));
    let specRaw = JSON.parse(fs.readFileSync('../metamui-core/chainspecs/devnet/specRaw.json'));

    for (const [key, value] of Object.entries(finalData)) {
        specRaw.genesis.raw.top[key] = value;
    }

    // fs.writeFileSync('data/relayFork.json', JSON.stringify(finalData));
    // fs.writeFileSync('data/updatedSpecRaw.json', JSON.stringify(specRaw));

    fs.writeFileSync('data/devnet/relayFork.json', JSON.stringify(finalData));
    fs.writeFileSync('data/devnet/updatedSpecRaw.json', JSON.stringify(specRaw));
        
    console.log('Completed Relay');
}

async function generateTokenchainSpec() {
    let state = JSON.parse(fs.readFileSync('../store-decode/data/state.json'));

    let tokenChains = [{
        currencyCode: 'SGD',
        currencyHex: '5347440000000000', /* SGD */
        wsUrl: 'ws://localhost:8844',
        root: '//Swn',
        region: ':yidindji:'
    },{
        currencyCode: 'DGTK',
        currencyHex: '4447544b00000000', /* DGTK */
        wsUrl: 'ws://localhost:8844',
        root: '//Swn',
        region: ':yidindji:'
    }];

    for ( const {currencyCode, currencyHex, wsUrl, root, region} of tokenChains) {

        let {encodedValues: tokenStore, didsWithAccount, ...tokenData} = token.generateToken(state.tokenStore, currencyHex);
        console.log("Token Store Updated");
    
        let didStore = did.generateCacheDids(state.didStore, stringToHex(region).slice(2), didsWithAccount);
        console.log("Did Store Updated");

        let vcStore = vc.generateTokenchainVC(state.vcStore, currencyHex);
        console.log("VC Store Updated");

        let finalData = {...didStore, ...tokenStore, ...vcStore};
            
        
        // // Update running network
        // let api = await connection.buildConnectionByUrl(wsUrl);
        
        // let keyring = await config.initKeyring();
        
        // // Root Key pair
        // let sigKeypair = keyring.addFromUri(root);
        
        // // Updates generated fork to running chain
        // await insertStorage(Object.entries(finalData), sigKeypair, api);
        
        // console.log("Updated");
        
        
        // let specRaw = JSON.parse(fs.readFileSync('../metamui-tokenchain/chainspecs/chainSpecRaw.json'));
        let specRaw = JSON.parse(fs.readFileSync('../metamui-tokenchain/chainspecs/devnet/specRaw.json'));
        
        specRaw.name = tokenData.tokenName + ' Devnet';
        specRaw.properties = tokenData.tokenProperties;
        
        for (const [key, value] of Object.entries(finalData)) {
            specRaw.genesis.raw.top[key] = value;
        }
        
        // fs.writeFileSync(`data/${currencyCode}TokenChainFork.json`, JSON.stringify(finalData));
        // fs.writeFileSync(`data/${currencyCode}TokenSpecRaw.json`, JSON.stringify(specRaw));

        fs.writeFileSync(`data/devnet/${currencyCode}TokenChainFork.json`, JSON.stringify(finalData));
        fs.writeFileSync(`data/devnet/${currencyCode}TokenSpecRaw.json`, JSON.stringify(specRaw));
        
        console.log('Completed Tokenchain');
    }
}


function main() {
    generateRelaySpec();
    generateTokenchainSpec();
}

main();