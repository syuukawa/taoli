import { Module } from '@nestjs/common';
import { ScheduleModule } from 'nest-schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { configService } from './config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
