import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import * as WebSocket from 'ws';
import * as _ from 'lodash';
import { address, bytes, numToHex, time } from './open-oracle/helpers';
import { encode, sign } from './open-oracle/reporter';

import { configService } from './config/config.service';

const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;

@Injectable()
export class AppService extends NestSchedule {
   
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * sync blocks from blockchain
   */
  @Interval(10000)
  async syncFromWootrade() { 
    console.log(" --- ContractAddress ---", configService.getContractAddress());

    const contractAddress = configService.getContractAddress(); //合约地址
    const fromAddress = configService.getFromAddress();
    const privateKey = configService.getPrivateKey();
    // const source = configService.getSource();
    // const key = configService.getKey();
    
      console.log("=== syncFromWootrade ===");
      let ws  = new WebSocket('wss://api.staging.woo.network/ws/stream?streams=bbo');
      await new Promise(resolve => ws.on('open', resolve));
     
      let priceFlg = true;
      let syncOracleFlg = true;
      let ethUsdtPrice = 0;
      let message = "";
      let signature = "";
      await new Promise(resolve =>
        ws.on('message', async data => {
          if(priceFlg){
            console.log("get eth_usdt price from wootrade === 111111 ");
            // 1. get eth_usdt price from wootrade 
            const wootradeBbo = JSON.parse(data);
            const bboTimestamp = wootradeBbo.timestamp;
            const bboData = wootradeBbo.data;
            const ethUsdt = _.find(bboData, function(o) { 
                return o.symbol ==  "SPOT_ETH_USDT"; 
              });
            console.log('ethUsdt ===>', ethUsdt);
            ethUsdtPrice = ethUsdt.b;
            console.log('ethUsdtPrice ===>', ethUsdtPrice);

            // 2.Get message and signature
            [{ message, signature }] = sign(
                encode('prices', time(), [['ETH', ethUsdtPrice]]),
                privateKey
            );
            priceFlg = false;
          } else {
            if(syncOracleFlg){
                syncOracleFlg = false; 
                console.log("sync eth_usdt price to oracle === 222222");
                // 3.sync eth_usdt price to oracle 
                // 创建web3对象
                const web3 = new Web3();
                // 连接到 kovan 测试节点
                web3.setProvider(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/1f3fa92bc461481bac2ab8473851992a"))
                const abi = [
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": false,
                                "internalType": "uint64",
                                "name": "priorTimestamp",
                                "type": "uint64"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "messageTimestamp",
                                "type": "uint256"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "blockTimestamp",
                                "type": "uint256"
                            }
                        ],
                        "name": "NotWritten",
                        "type": "event"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "bytes",
                                "name": "message",
                                "type": "bytes"
                            },
                            {
                                "internalType": "bytes",
                                "name": "signature",
                                "type": "bytes"
                            }
                        ],
                        "name": "put",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "source",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "string",
                                "name": "key",
                                "type": "string"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint64",
                                "name": "timestamp",
                                "type": "uint64"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint64",
                                "name": "value",
                                "type": "uint64"
                            }
                        ],
                        "name": "Write",
                        "type": "event"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "source",
                                "type": "address"
                            },
                            {
                                "internalType": "string",
                                "name": "key",
                                "type": "string"
                            }
                        ],
                        "name": "get",
                        "outputs": [
                            {
                                "internalType": "uint64",
                                "name": "",
                                "type": "uint64"
                            },
                            {
                                "internalType": "uint64",
                                "name": "",
                                "type": "uint64"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "source",
                                "type": "address"
                            },
                            {
                                "internalType": "string",
                                "name": "key",
                                "type": "string"
                            }
                        ],
                        "name": "getPrice",
                        "outputs": [
                            {
                                "internalType": "uint64",
                                "name": "",
                                "type": "uint64"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "bytes",
                                "name": "message",
                                "type": "bytes"
                            },
                            {
                                "internalType": "bytes",
                                "name": "signature",
                                "type": "bytes"
                            }
                        ],
                        "name": "source",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "pure",
                        "type": "function"
                    }
                ]; // 合约ABI
    
                const priceContract = new web3.eth.Contract(abi, contractAddress); // 通过ABI和地址获取已部署的合约对象
                const myData = priceContract.methods.put(message,signature).encodeABI();
            
                //const gasPrice = web3.eth.gasPrice;
                var txCount = await web3.eth.getTransactionCount(fromAddress);
                const txObj = {
                  nonce:    web3.utils.toHex(txCount),
                  to:       contractAddress,
                  value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
                  gasLimit: web3.utils.toHex(3000000),
                  gasPrice: web3.utils.toHex(web3.eth.gasPrice),
                  data: myData
                }
            
                var signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
                var txResule = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            
                console.log(" ============= 交易成功，交易hash：" ,txResule.transactionHash); 
            }
          }
        }),
      );
  }
}
