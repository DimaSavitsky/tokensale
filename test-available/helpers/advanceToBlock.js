/**
 * [advanceBlock description]
 * @return {[type]} [description]
 */
function advanceBlock() {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: '2.0',
            method: 'evm_mine',
            id: Date.now(),
        }, (err, res) => (err ? reject(err) : resolve(res))
        );
    });
}

/**
 * [advanceToBlock description]
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
module.exports = async function advanceToBlock(number) {
    if (web3.eth.blockNumber > number) {
        throw Error(`block number ${number} is in the past (current is ${web3.eth.blockNumber})`);
    }

    while (web3.eth.blockNumber < number) {
        await advanceBlock(); // eslint-disable-line no-await-in-loop
    }
};
