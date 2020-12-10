import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { address, bytes, numToHex, time } from './open-oracle/helpers';
import { encode, sign } from './open-oracle/reporter';

describe('AppController', () => {
  let app: TestingModule;

  const privateKey =
  '0x3ce6001b8d44c5efd7dcc7010e75c1e05e246ef43cef3983f6d8d32002be81e8';
  const signer = '0x8d8D8dE95DF82455c887661ada3F3FA07e93fbbD';

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('source() should ecrecover correctly', async () => {
        const [{ message, signature }] = sign(
          encode('prices', time(), [['ETH', 710]]),
          privateKey
        );
        console.log(" message ===> ", message);
        console.log(" signature ===> ", signature);
    });
  });
});
