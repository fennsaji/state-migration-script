const {utils} = require("metamui-sdk");
const {bnToHex} = require('@polkadot/util');

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

    console.log(utils.decodeHex("0x3c9dc1c9f5a975e285d1bf7b35b361fa223db342fe4211d8ec856da41bc39f026469643a737369643a66616d6531323300000000000000000000000000000000046469643a737369643a737572796132303232000000000000000000000000000004c0f28a5b2d8bbcff73d12e46a9928866b59a02b719d1a6e141861d3f937b9558928e5eca43872fa267a74eb65189c739723a0b1e2fe86aa5953950e551cf10810001005465737420446f6c6c61722030310000e80300000000000000000000000000000254444f4e45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "VC"))

    console.log(utils.decodeHex("0x5465737420446f6c6c61722030310000e80300000000000000000000000000000254444f4e45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "TokenVC"))

    for (const {key, value} of Object.values(vcStore.vcs)) {
        if(key.startsWith(vcs_key)) {
            let updated_key = key.replace(vcs_key, new_vcs_key);
            let updated_value = {
                ...value[0],
                is_vc_active: value[1] == "Active",
            }
            encodedValues[updated_key] = utils.encodeData(updated_value, "VC");
        }
    }
    for (const {key, value} of Object.values(vcStore.lookups)) {
        if(key.startsWith(lookup_key)) {
            let updated_key = key.replace(lookup_key, new_lookup_key);
            encodedValues[updated_key] = utils.encodeData(value, "Vec<VCid>");
        }
    }
    for (const {key, value} of Object.values(vcStore.rlookups)) {
        if(key.startsWith(rlookup_key)) {
            let updated_key = key.replace(rlookup_key, new_rlookup_key);
            encodedValues[updated_key] = utils.encodeData(value, "Did");
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
            let updated_key = key.replace(vcapprover_key, new_vcapprover_key);
            encodedValues[updated_key] = utils.encodeData(value, "Vec<Did>");
        }
    }

    return encodedValues;
}

module.exports = {
    generateVCs,
}