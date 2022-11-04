const {utils} = require("metamui-sdk");

function generateCouncil(validatorSetStore) {
    let member_key = '0xf9922c78cfa3c316d27a3eb48145ab1bba7fb8745735dc3be2a2c61a72c39e78';
    let prime_key = '0xf9922c78cfa3c316d27a3eb48145ab1bcb3136ee16886ac28a54f39e605b387a';

    let new_member_key = '0xaebd463ed9925c488c112434d61debc0ba7fb8745735dc3be2a2c61a72c39e78';
    let new_prime_key = '0xaebd463ed9925c488c112434d61debc0cb3136ee16886ac28a54f39e605b387a';


    let encodedValues = {};

    let old_member_key = validatorSetStore.members.key;
    let old_member_value = validatorSetStore.members.value;
    if(old_member_key.startsWith(member_key)) {
        let updated_key = old_member_key.replace(member_key, new_member_key);
        encodedValues[updated_key] = utils.encodeData(old_member_value, "Vec<Did>");
    }

    let old_prime_key = validatorSetStore.prime.key;
    let old_prime_value = validatorSetStore.prime.value;
    if(old_prime_key.startsWith(prime_key)) {
        let updated_key = old_prime_key.replace(prime_key, new_prime_key);
        encodedValues[updated_key] = utils.encodeData(old_prime_value, "Did");
    }

    return encodedValues;
}

module.exports = {
    generateCouncil,
}