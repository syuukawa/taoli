import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';

import { ChainId, Token, WETH, Fetcher, Route } from '@uniswap/sdk'

import { TokenType } from './app.interface';

var axios = require('axios');

// Infrua Error: Returned error: daily request count exceeded, request rate limited

@Injectable()
export class AppService extends NestSchedule {

    constructor() {
        super();
    }

    getHello(): string {
    return 'Hello World!';
  }

  public async getAllTokensInUniswap(): Promise<string> {

    var data = JSON.stringify({
        query: `{
          tokens(first: 1, skip: 1) {
           id
           name
           symbol
          }
      }`,
        variables: {}
      });

      var config = {
        method: 'post',
        url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        headers: {
          'Content-Type': 'application/json',
        },
        data : data
      };

      return axios(config)
      .then(async function (response) {

        //1.data
        const data = response.data.data;
        // console.log('data === ',response.data.data);
        // { tokens:
        //     [ { id: '0x0000000000085d4780b73119b644ae5ecd22b376',
        //         name: 'TrueUSD',
        //         symbol: 'TUSD' } ] }
        //2.tokens
        const tokensObj = data.tokens;
        // console.log('tokens === ',tokensObj);
        // tokens ===  [ { id: '0x0000000000085d4780b73119b644ae5ecd22b376',
        //             name: 'TrueUSD',
        //             symbol: 'TUSD' } ]
        //3.token
        let tokens: TokenType[] = [];
        for (const tokenObj of tokensObj) {
            console.log('tokenObj ===',tokenObj);
            const token: TokenType = {
              id: tokenObj.id,
              name: tokenObj.name,
              symbol: tokenObj.symbol
            };
            //console.log('token ===',token);
            // await this.getMidPriceToWETH(tokenObj.id);

            // tokens.push(token);
        }
        // console.log('tokens length',tokens.length);

        return JSON.stringify(response.data);
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  @Interval(10000) // 10 second
  public async getMidPriceToWETH(tokenAddr: string): Promise<string> {
    const token = new Token(ChainId.MAINNET, tokenAddr, 18)
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(token, WETH[token.chainId])
    const route = new Route([pair], WETH[token.chainId])
    console.log("midprice to ETH", route.midPrice.toSignificant(6)) // 201.306
    console.log("midprice to ETH invert ", route.midPrice.invert().toSignificant(6)) // 0.00496756

    let obj = {};

    obj["midPrice"] = route.midPrice.toSignificant(6);
    obj["invertMidPrice"] = route.midPrice.invert().toSignificant(6);

    let price = new Promise<string>((resolve, reject) => {
       resolve(JSON.stringify(obj));
    });

    return price;
  }

  public async getMidPriceFromUsdtToWeth(id: string) {
    // DAI and WETH doesn’t exist.
    // 1.DAI -> USDT
    // 2.USDT -> WETH
    const USDT = new Token(ChainId.MAINNET, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6)
    const token = new Token(ChainId.MAINNET, id, 18)

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const USDTWETHPair = await Fetcher.fetchPairData(USDT, WETH[ChainId.MAINNET])
    const tokenUSDTPair = await Fetcher.fetchPairData(token, USDT)

    const route = new Route([USDTWETHPair, tokenUSDTPair], WETH[ChainId.MAINNET])

    console.log(route.midPrice.toSignificant(6)) // 202.081
    console.log(route.midPrice.invert().toSignificant(6)) // 0.00494851
  }
}
