import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

require('dotenv').config();

class DatabaseCfg {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = <string>this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('POSTGRES_PORT', true);
  }
  public getHost() {
    return this.getValue('POSTGRES_HOST', true);
  }
  public getUsername() {
    return this.getValue('POSTGRES_USER', true);
  }
  public getPassword() {
    return this.getValue('POSTGRES_PASSWORD', true);
  }
  public getDatabase() {
    return this.getValue('POSTGRES_DATABASE', true);
  }

  public isProduction(): boolean  {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(entities: any[] | null=null): TypeOrmModuleOptions {
    let entitiesToApply = ["dist/**/*.entity{.ts,.js}"];
    if (entities != null) {
      entitiesToApply.push(...entities);
    }
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: entitiesToApply,
      synchronize: true,
      autoLoadEntities: true,
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      migrationsRun: true,
      ssl: this.isProduction(),
    };
  }
}


const databaseCfg = new DatabaseCfg(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ]);
  

const appDataSource = new DataSource({
  type: 'postgres',
  host: databaseCfg.getHost(),
  port: parseInt(databaseCfg.getPort()),
  username: databaseCfg.getUsername(),
  password: databaseCfg.getPassword(),
  database: databaseCfg.getDatabase(),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default appDataSource;
export { databaseCfg as databaseCfgForPostgres };