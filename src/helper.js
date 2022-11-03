function submitTransaction(signedTx, api) {
    let returnObj = {
        transactionHash: "",
        events: {},
    };
    return new Promise(async (resolve, reject) => {
        await signedTx.send(function ({ status, events, dispatchError }) {
            if (dispatchError) {
                if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                    const { docs, section, name } = decoded;
                    console.log(`${section}.${name}: ${docs.join(' ')}`);
                    reject(new Error(`${section}.${name}`));
                } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    reject(new Error(dispatchError.toString()));
                }
            } else if (status.isFinalized) {
                // console.log('Finalized block hash', status.asFinalized.toHex());
                events.forEach(({ phase, event: { data, method, section } }) => {
                    // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toHuman());
                    let eventObj = {};
                    eventObj[section] = {};
                    eventObj[section][method] = data.toHuman();
                    returnObj.events = {...returnObj.events, ...eventObj};
                });
                returnObj.transactionHash = signedTx.hash.toHex();
                // console.log(returnObj);
                resolve(returnObj);
            }
        });
    });
}

async function insertStorage(items, signingKeypair, provider) {
    const tx = provider.tx.sudo.sudo(provider.tx.system.setStorage(items));
    let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
    let signedTx = await tx.signAsync(signingKeypair, { nonce });
    return submitTransaction(signedTx, provider);
}


module.exports = {
    submitTransaction,
    insertStorage,
}