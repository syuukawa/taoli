import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/allTokensInUniswap')
  async getAllTokensInUniswap(): Promise<string> {
    const allTokens = await this.appService.getAllTokensInUniswap();
    return allTokens;
  }

  @Get(':tokenAddr/midPriceToWETH')
  async getMidPriceToWETH(@Param('tokenAddr') tokenAddr: string): Promise<string> {
    console.log('tokenAddr', tokenAddr);
    const result = await this.appService.getMidPriceToWETH(tokenAddr);
    return result;
  }

  @Get(':id/midPriceFromUsdtToWeth')
  async getMidPriceFromUsdtToWeth(@Param('id') id: string) {
    console.log('id',id);
    await this.appService.getMidPriceFromUsdtToWeth(id);
  }
}
