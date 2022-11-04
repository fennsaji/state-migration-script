const {utils} = require("metamui-sdk");
const {bnToHex} = require('@polkadot/util');

function generateValidatorSet(validatorSetStore) {
    let member_key = '0x7d9fe37370ac390779f35763d98106e8ba7fb8745735dc3be2a2c61a72c39e78';

    let new_member_key = '0x7d9fe37370ac390779f35763d98106e8ba7fb8745735dc3be2a2c61a72c39e78';

    let committee_members_key = '0x2f63d52e4f93d9956b936c6859bd0f8dba7fb8745735dc3be2a2c61a72c39e78';

    let encodedValues = {};

    let old_member_key = validatorSetStore.members.key;
    let old_member_value = validatorSetStore.members.value;
    if(old_member_key.startsWith(member_key)) {
        let updated_key = old_member_key.replace(member_key, new_member_key);
        encodedValues[updated_key] = utils.encodeData(old_member_value, "Vec<Did>");
        let comm_updated_key = old_member_key.replace(member_key, committee_members_key);
        encodedValues[comm_updated_key] = utils.encodeData(old_member_value, "Vec<Did>");
    }

    return encodedValues;
}

module.exports = {
    generateValidatorSet,
}