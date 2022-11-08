// TODO: Token accounts to be generated for given list of currency
// Token Account: 0xcb732bb8b688ea549fec1838a1350aedb99d880ec681799c0cf30e8886371da9
// +  Blake 2 concat 128 (Did in hex 32 bytes)

const {utils} = require("metamui-sdk");

const { blake2AsHex } =  require('@polkadot/util-crypto');
const { hexToString } = require("metamui-sdk/dist/utils");
const {bnToHex, hexToBn} = require('@polkadot/util');

function generateToken(tokenStore, currency_code) {

    let accounts_key = '0x99971b5749ac43e0235e41b0d37869188ee7418a6531173d60d1f6a82d8f4d51';

    let new_accounts_key = '0xcb732bb8b688ea549fec1838a1350aedb99d880ec681799c0cf30e8886371da9';
    let new_total_issuance_key = '0xc2261276cc9d1f8598ea4b6a74b15c2f57c875e4cff74148e4628f264b974c80';


    // Accounts is now moved to token.accounts
    let newTokenStore = {
        encodedValues: [],
        tokenProperties: {},
        tokenName:  '',
        tokenIssuer: ''
    };
    for (const {key, value} of Object.values(tokenStore.accounts)) {
        let currency_code_key = key.slice(key.length - 16);
        if (currency_code_key == currency_code) {
            // let updated_key = key.replace(accounts_key, new_accounts_key);
            let did = '0x' + key.slice(key.length - 96, key.length - 32);
            // let currencyCode = '0x' + key.slice(key.length - 32);
            let updated_key = new_accounts_key + blake2AsHex(did, 128).slice(2) + did.slice(2);
            let updated_value = {
                nonce: value.nonce,
                consumers: value.refcount,
                providers: 1,
                sufficients: 0,
                data: utils.encodeData(value.data, "AccountData"),
            }
            newTokenStore.encodedValues[updated_key] = utils.encodeData(updated_value, "AccountInfo");
        }
    }

    for (const {key, value} of Object.values(tokenStore.tokenData)) {
        let currency_code_key = key.slice(key.length - 16);
        if (currency_code_key == currency_code) {
            newTokenStore.tokenProperties = {
                ss58Format: 42,
                tokenDecimals: value.decimal,
                tokenSymbol: hexToString(value.currency_code),
            };
            newTokenStore.tokenName = hexToString(value.token_name);
        }
    } 

    // TODO: Add to token pallet
    for (const {key, value} of Object.values(tokenStore.tokenIssuer)) {
        let currency_code_key = key.slice(key.length - 16);
        if (currency_code_key == currency_code) {
            newTokenStore.tokenIssuer = value;
        }
    }

    for (const {key, value} of Object.values(tokenStore.totalIssuance)) {
        let currency_code_key = key.slice(key.length - 16);
        if (currency_code_key == currency_code) {
            newTokenStore.encodedValues[new_total_issuance_key] = utils.encodeData(value, "Balance");
        }
    }
    
    return newTokenStore;
}

module.exports = {
    generateToken,
}