const {connection, config} = require("metamui-sdk");
const balance = require("./src/balance");
const did = require("./src/did");
const vc = require("./src/vc");
const token = require("./src/token");
const council = require("./src/council");
const validator_set = require("./src/validator_set");
const fs = require('fs');

const { stringToHex } = require("@polkadot/util");

const yargs = require('yargs');

const argv = yargs
    .command('deploy', 'Prepare for deployment', {
        env: {
            description: 'Environment (devnet / protonet / mainnet)',
            alias: 'e',
            type: 'string'
        },
    })
    .help()
    .alias('help', 'h').argv;

let env = argv.env || argv.e;
switch(env) {
    case 'dev': 
    case 'devnet': 
    case 'testnet': 
        env = 'devnet';
        break;
    case 'demo': 
    case 'demonet': 
    case 'protonet': 
        env = 'protonet';
        break;
    case 'main': 
    case 'mainnet': 
        env = 'mainnet';
        break;
    default: 
        throw new Error("Unknown Env. Supported Env: devnet/ protonet/ mainnet")
}


async function generateRelaySpec(env='devnet') {
    let state = JSON.parse(fs.readFileSync(`../store-decode/data/${env}/state.json`));
    
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

    let specRaw = JSON.parse(fs.readFileSync(`../metamui-core/chainspecs/${env}/specRaw.json`));

    for (const [key, value] of Object.entries(finalData)) {
        specRaw.genesis.raw.top[key] = value;
    }

    fs.writeFileSync(`data/${env}/relayFork.json`, JSON.stringify(finalData));
    fs.writeFileSync(`../metamui-core/chainspecs/${env}/updatedSpecRaw.json`, JSON.stringify(specRaw));
        
    console.log('Completed Relay');
}

async function generateTokenchainSpec(env='devnet') {
    let state = JSON.parse(fs.readFileSync(`../store-decode/data/${env}/state.json`));

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
            
        let specRaw = JSON.parse(fs.readFileSync(`../metamui-tokenchain/chainspecs/${env}/specRaw.json`));
        
        specRaw.name = tokenData.tokenName + ` ${env}`;
        specRaw.properties = tokenData.tokenProperties;
        
        for (const [key, value] of Object.entries(finalData)) {
            specRaw.genesis.raw.top[key] = value;
        }

        fs.writeFileSync(`data/${env}/${currencyCode}Fork.json`, JSON.stringify(finalData));
        fs.writeFileSync(`../metamui-tokenchain/chainspecs/${env}/${currencyCode}/specRaw.json`, JSON.stringify(specRaw));
        
        console.log('Completed Tokenchain');
    }
}


function main(env) {
    generateRelaySpec(env);
    generateTokenchainSpec(env);
    process.exit(0);
}

main(env);