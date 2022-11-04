const {utils} = require("metamui-sdk");
const {bnToHex} = require('@polkadot/util');

function generateBalances(balanceStore) {
    let account_key = '0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9';
    let locks_key = '0xc2261276cc9d1f8598ea4b6a74b15c2f218f26c73add634897550b4003b26bc6';
    let total_issuance_key = '0xc2261276cc9d1f8598ea4b6a74b15c2f57c875e4cff74148e4628f264b974c80';

    let new_account_key = '0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9';
    let new_locks_key = '0xc2261276cc9d1f8598ea4b6a74b15c2f218f26c73add634897550b4003b26bc6';
    let new_total_issuance_key = '0xc2261276cc9d1f8598ea4b6a74b15c2f57c875e4cff74148e4628f264b974c80';

    let encodedValues = {};

    for (const {key, value} of Object.values(balanceStore.accounts)) {
        if(key.startsWith(account_key)) {
            let updated_key = key.replace(account_key, new_account_key);
            encodedValues[updated_key] = utils.encodeData(value, "AccountData");
        }
    }
    for (const {key, value} of Object.values(balanceStore.locks)) {
        if(key.startsWith(locks_key)) {
            let updated_key = key.replace(locks_key, new_locks_key);
            encodedValues[updated_key] = utils.encodeData(value, "Vec<BalanceLock>");
        }
    }
    if(balanceStore.totalIssuance.key == total_issuance_key) {
        encodedValues[new_total_issuance_key] = bnToHex(balanceStore.totalIssuance.value, { isLe: true }).padEnd(34, "0");
    }

    return encodedValues;
}

module.exports = {
    generateBalances,
}