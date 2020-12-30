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

  @Get(':id/midPriceToWETH')
  async getMidPriceToWETH(@Param('id') id: string) {
    console.log('id',id);
    await this.appService.getMidPriceToWETH(id);
  }

  @Get(':id/midPriceFromUsdtToWeth')
  async getMidPriceFromUsdtToWeth(@Param('id') id: string) {
    console.log('id',id);
    await this.appService.getMidPriceFromUsdtToWeth(id);
  }
}
