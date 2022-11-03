const {utils} = require("metamui-sdk");

function generatedDids(didStore) {
    let accounts_key = '0x8c00ca9d36dbd8b4d8e6b787982148bcb99d880ec681799c0cf30e8886371da9';
    let dids_key = '0x8c00ca9d36dbd8b4d8e6b787982148bce395ab58338d83d25270a3a12ce872f8';
    let lookup_key = '0x8c00ca9d36dbd8b4d8e6b787982148bc891ad457bf4da54990fa84a2acb148a2';
    let rlookup_key = '0x8c00ca9d36dbd8b4d8e6b787982148bcf65cb14646e631fff440382018b1bfe4';
    let prevkeys_key = '0x8c00ca9d36dbd8b4d8e6b787982148bc90cd84a4f521e9018818dffdac4a5860';

    let new_accounts_key = '0xcb732bb8b688ea549fec1838a1350aedb99d880ec681799c0cf30e8886371da9';
    let new_dids_key = '0x7a7b34fdb954e2e22000798738d613cde395ab58338d83d25270a3a12ce872f8';
    let new_lookup_key = '0x7a7b34fdb954e2e22000798738d613cd891ad457bf4da54990fa84a2acb148a2';
    let new_rlookup_key = '0x7a7b34fdb954e2e22000798738d613cdf65cb14646e631fff440382018b1bfe4';
    let new_prevkeys_key = '0x7a7b34fdb954e2e22000798738d613cd90cd84a4f521e9018818dffdac4a5860';
    
    let encodedValues = {};

    // Accounts is now moved to token.accounts
    for (const {key, value} of Object.values(didStore.accounts)) {
        let updated_key = key.replace(accounts_key, new_accounts_key);
        let updated_value = {
            nonce: value.nonce,
            consumers: value.refcount,
            providers: 1,
            sufficients: 0,
            data: value.data,
        }
        encodedValues[updated_key] = utils.encodeData(updated_value, "AccountInfo");
    }

    for (const {key, value} of Object.values(didStore.dids)) {
        let updated_key = key.replace(dids_key, new_dids_key);
        let updated_value = [{
            Private: {
                ...value[0],
            }
        }, 0];
        // value[1]
        // Setting block number as 0
        encodedValues[updated_key] = utils.encodeData(updated_value, "(DIdentity, BlockNumber)");
    }

    for (const {key, value} of Object.values(didStore.lookups)) {
        let updated_key = key.replace(lookup_key, new_lookup_key);
        encodedValues[updated_key] = utils.encodeData(value, "AccountId");
    }

    for (const {key, value} of Object.values(didStore.rlookups)) {
        let updated_key = key.replace(rlookup_key, new_rlookup_key);
        encodedValues[updated_key] = utils.encodeData(value, "Did");
    }

    // THIS IS NOT NEEDED AS PREVIOUS KEYS IS BASED ON BLOCK NUMBER
    // for (const {key, value} of Object.values(didStore.prevkeys)) {
    //     let updated_key = key.replace(prevkeys_key, new_prevkeys_key);
    //     let updated_value = [
    //         value[0],
    //         value[1],
    //     ];
    //     encodedValues[updated_key] = utils.encodeData(updated_value, "PrevKeysMap");
    // }

    return encodedValues;
}

module.exports = {
    generatedDids,
}