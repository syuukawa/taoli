import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public get(key: string): string {
    return this.getValue(key, true);
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getContractAddress() {
    return this.getValue('CONTRACT_ADDRESS', true);
  }

  public getSource() {
    return this.getValue('SOURCE', true);
  }

  public getFromAddress() {
    return this.getValue('FROM_ADDRESS', true);
  }

  public getPrivateKey() {
    return this.getValue('PRIVATE_KEY', true);
  }

  public getKey() {
    return this.getValue('KEY', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: "127.0.0.1",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "taoliDB",

      entities: [`./src/**/*.entity{.ts,.js}`],
      migrationsTableName: 'migration',
      migrations: [`./src/migration/**{.ts,.js}`],

      cli: {
        migrationsDir: `./src/migration`
      },

      ssl: false,
    };
  }
}


const configService = new ConfigService(process.env)
  .ensureValues([
    'CONTRACT_ADDRESS',
    'SOURCE',
    'FROM_ADDRESS',
    'PRIVATE_KEY',
    'KEY'
  ]);

export { configService };