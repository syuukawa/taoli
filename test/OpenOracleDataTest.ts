// const { address, bytes, numToHex, time } = require('./Helpers');

// const { encode, sign } = require('../sdk/javascript/.tsbuilt/reporter');

// describe('OpenOracleData', () => {
//   let oracleData;
//   let priceData;
//   const privateKey =
//     '0x3ce6001b8d44c5efd7dcc7010e75c1e05e246ef43cef3983f6d8d32002be81e8';
//   const signer = '0x8d8D8dE95DF82455c887661ada3F3FA07e93fbbD';
  
//   beforeEach(async done => {
//     oracleData = await deploy('OpenOracleData', []);
//     priceData = await deploy('OpenOraclePriceData', []);
//     done();
//   });

//   it('has correct default data', async () => {
//     let { 0: timestamp, 1: value } = await call(priceData, 'get', [
//       address(0),
//       'ETH'
//     ]);

//     expect(timestamp).numEquals(0);
//     expect(value).numEquals(0);
//   });

//   it('source() should ecrecover correctly', async () => {
//     const [{ message, signature }] = sign(
//       encode('prices', time(), [['ETH', 700]]),
//       privateKey
//     );
//     await send(priceData, 'put', [message, signature], {
//       gas: 1000000
//     });

//     expect(await call(oracleData, 'source', [message, signature])).toEqual(
//       signer
//     );
//     expect(
//       await call(oracleData, 'source', [bytes('bad'), signature])
//     ).not.toEqual(signer);
//     await expect(
//       call(oracleData, 'source', [message, bytes('0xbad')])
//     ).rejects.toRevert();
//   });

//   it('should save data from put()', async () => {
//     const timestamp = time() - 1;
//     const ethPrice = 700;
//     const [{ message, signature }] = sign(
//       encode('prices', timestamp, [['ETH', ethPrice]]),
//       privateKey
//     );

//     const putTx = await send(priceData, 'put', [message, signature], {
//       gas: 1000000
//     });
//     expect(putTx.gasUsed).toBeLessThan(86000);
//   });

//   /** 
//    * Error  test
//    * */
//   it('sending data from before previous checkpoint should fail', async () => {
//     const timestamp = time() - 1;
//     let [{ message, signature }] = sign(
//       encode('prices', timestamp, [['ABC', 100]]),
//       privateKey
//     );
//     await send(priceData, 'put', [message, signature], {
//       gas: 1000000
//     });

//     const timestamp2 = timestamp - 1;
//     const [{ message: message2, signature: signature2 }] = sign(
//       encode('prices', timestamp2, [['ABC', 150]]),
//       privateKey
//     );
//     const putTx = await send(priceData, 'put', [message2, signature2], {
//       gas: 1000000
//     });

//     expect(putTx.events.NotWritten).not.toBe(undefined);

//     ({ 0: signedTimestamp, 1: value } = await call(priceData, 'get', [
//       signer,
//       'ABC'
//     ]));
//     expect(value / 1e6).toBe(100);
//   });

//   /** 
//    * Error  test
//    * */
//   it('signing future timestamp should not write to storage', async () => {
//     const timestamp = time() + 3601;
//     const [{ message, signature }] = sign(
//       encode('prices', timestamp, [['ABC', 100]]),
//       privateKey
//     );
//     const putTx = await send(priceData, 'put', [message, signature], {
//       gas: 1000000
//     });
//     expect(putTx.events.NotWritten).not.toBe(undefined);
//     ({ 0: signedTimestamp, 1: value } = await call(priceData, 'get', [
//       signer,
//       'ABC'
//     ]));
//     expect(+value).toBe(0);
//   });

//   it('two pairs with update', async () => {
//     const timestamp = time() - 2;
//     const signed = sign(
//       encode('prices', timestamp, [['ABC', 100], ['BTC', 9000]]),
//       privateKey
//     );

//     for ({ message, signature } of signed) {
//       await send(priceData, 'put', [message, signature], {
//         gas: 1000000
//       });
//     }

//     ({ 0: signedTime, 1: value } = await call(priceData, 'get', [
//       signer,
//       'BTC'
//     ]));
//     expect(value / 1e6).numEquals(9000);

//     ({ 0: signedTime, 1: value } = await call(priceData, 'get', [
//       signer,
//       'ABC'
//     ]));
//     expect(value / 1e6).numEquals(100);

//     //2nd tx
//     const later = timestamp + 1;

//     const signed2 = sign(
//       encode('prices', later, [['ABC', 101], ['BTC', 9001]]),
//       privateKey
//     );

//     for ({ message, signature } of signed2) {
//       const wrote2b = await send(priceData, 'put', [message, signature], {
//         gas: 1000000
//       });
//       expect(wrote2b.gasUsed).toBeLessThan(75000);
//     }

//     ({ 0: signedTime, 1: value } = await call(priceData, 'get', [
//       signer,
//       'BTC'
//     ]));
//     expect(value / 1e6).numEquals(9001);

//     ({ 0: signedTime, 1: value } = await call(priceData, 'get', [
//       signer,
//       'ABC'
//     ]));
//     expect(value / 1e6).numEquals(101);
//   });
// });
