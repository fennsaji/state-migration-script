const {utils} = require("metamui-sdk");
const {bnToHex} = require('@polkadot/util');

let relay_vc_types = [
    "TokenVC",
    "GenericVC",
];
let tokenchain_vc_types = [
    "SlashTokens",
    "MintTokens",
    "TokenTransferVC",
];

function generateVCs(vcStore) {
    let vcs_key = '0xadf7562815365fcd9a52b5bb27961ddd225a174d55e19c40ae90fdfb2e26e068';
    let lookup_key = '0xadf7562815365fcd9a52b5bb27961ddd891ad457bf4da54990fa84a2acb148a2';
    let rlookup_key = '0xadf7562815365fcd9a52b5bb27961dddf65cb14646e631fff440382018b1bfe4';
    let vchistory_key = '0xadf7562815365fcd9a52b5bb27961ddd75115eefb6987d5a914c7f8f5f7f81f2';
    let vcapprover_key = '0xadf7562815365fcd9a52b5bb27961ddd56035760bb8688445c0a50de5e58820f';

    let new_vcs_key = '0xadf7562815365fcd9a52b5bb27961ddd225a174d55e19c40ae90fdfb2e26e068';
    let new_lookup_key = '0xadf7562815365fcd9a52b5bb27961ddd891ad457bf4da54990fa84a2acb148a2';
    let new_rlookup_key = '0xadf7562815365fcd9a52b5bb27961dddf65cb14646e631fff440382018b1bfe4';
    let new_vchistory_key = '0xadf7562815365fcd9a52b5bb27961ddd75115eefb6987d5a914c7f8f5f7f81f2';
    let new_vcapprover_key = '0xadf7562815365fcd9a52b5bb27961ddd56035760bb8688445c0a50de5e58820f';

    let encodedValues = {};

    let relay_vc_ids = [];

    for (const {key, value} of Object.values(vcStore.vcs)) {
        if(key.startsWith(vcs_key)) {
            if(relay_vc_types.includes(value[0].vc_type)) {
                let vc_id = `${key.slice(key.length - 64)}`;
                relay_vc_ids.push(vc_id);
                let updated_key = key.replace(vcs_key, new_vcs_key);
                let updated_value = {
                    ...value[0],
                    is_vc_active: value[1] == "Active",
                }
                encodedValues[updated_key] = utils.encodeData(updated_value, "VC<Hash>");
                console.log(utils.decodeHex(encodedValues[updated_key], "VC<Hash>"));
            }
        }
    }
    for (const {key, value} of Object.values(vcStore.lookups)) {
        if(key.startsWith(lookup_key)) {
            let updated_key = key.replace(lookup_key, new_lookup_key);
            let updated_value = [];
            for (const vc_id of value) {
                if(relay_vc_ids.includes(vc_id.slice(2))) {
                    updated_value.push(vc_id);
                }
            }
            if (updated_value.length != 0 ) {
                encodedValues[updated_key] = utils.encodeData(value, "Vec<VCid>");
            }
        }
    }
    for (const {key, value} of Object.values(vcStore.rlookups)) {
        let vc_id = `${key.slice(key.length - 64)}`;
        if(key.startsWith(rlookup_key)) {
            if(relay_vc_ids.includes(vc_id)) {
                let updated_key = key.replace(rlookup_key, new_rlookup_key);
                encodedValues[updated_key] = utils.encodeData(value, "Did");
            }
        }
    }
    // THIS IS NOT NEEDED AS IT IS BASED ON BLOCK NUMBER
    // for (const {key, value} of Object.values(vcStore.vcHistory)) {
    //     if(key.startsWith(vchistory_key)) {
    //         let updated_key = key.replace(vchistory_key, new_vchistory_key);
    //         let updated_value = [
    //             value[0] == "Active",
    //             value[1],
    //         ]
    //         encodedValues[updated_key] = utils.encodeData(updated_value, "(bool, BlockNumber)");
    //     }
    // }
    for (const {key, value} of Object.values(vcStore.vcApproverList)) {
        if(key.startsWith(vcapprover_key)) {
            let vc_id = `${key.slice(key.length - 64)}`;
            if(relay_vc_ids.includes(vc_id)) {
                let updated_key = key.replace(vcapprover_key, new_vcapprover_key);
                encodedValues[updated_key] = utils.encodeData(value, "Vec<Did>");
            }
        }
    }

    return encodedValues;
}

module.exports = {
    generateVCs,
}