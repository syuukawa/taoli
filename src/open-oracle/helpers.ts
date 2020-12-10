import BigNumber from "bignumber.js";

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/1f3fa92bc461481bac2ab8473851992a")); // no provider, since we won't make any calls

export const fixed = num => {
  return (new BigNumber(num).toFixed());
};

export function uint(n) {
  return web3.utils.toBN(n).toString();
}

export function keccak256(str) {
  return web3.utils.keccak256(str);
}

export function address(n) {
	return `0x${n.toString(16).padStart(40, '0')}`;
}

export function bytes(str) {
	return web3.eth.abi.encodeParameter('string', str);
}

export function uint256(int) {
	return web3.eth.abi.encodeParameter('uint256', int);
}

export function numToHex(num) {
	return web3.utils.numberToHex(num);
}

export function numToBigNum(num) {
	return web3.utils.toBN(num);
}

export function time(){
    const dateTime: any = new Date();
	return Math.floor(dateTime / 1000);
}

export async function currentBlockTimestamp(web3_) {
  const blockNumber: any = await sendRPC(web3_, "eth_blockNumber", []);
  const block: any = await sendRPC(web3_, "eth_getBlockByNumber", [ blockNumber.result, false]);
  return block.result.timestamp;
}

export function sendRPC(web3_, method, params) {
  return new Promise((resolve, reject) => {
    if (!web3_.currentProvider || typeof (web3_.currentProvider) === 'string') {
      return reject(`cannot send from currentProvider=${web3_.currentProvider}`);
    }

    web3_.currentProvider.send(
      {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: new Date().getTime() // Id of the request; anything works, really
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
}

// module.exports = {
//   sendRPC,
//   address,
//   bytes,
//   time,
//   numToBigNum,
//   numToHex,
//   uint256,
//   uint,
//   keccak256,
//   currentBlockTimestamp,
//   fixed
// };
