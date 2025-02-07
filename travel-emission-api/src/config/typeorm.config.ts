import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(entities: any[] | null=null): TypeOrmModuleOptions {
    let entities_to_apply = ["dist/**/*.entity{.ts,.js}"];
    if (entities != null) {
      entities_to_apply.push(...entities);
    }
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: entities_to_apply,
      synchronize: true,
      autoLoadEntities: true,
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      migrationsRun: true,
      ssl: this.isProduction(),
    };
  }
}


const databaseCfgForPostgres = new DatabaseCfg(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ]);
  

const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseCfgForPostgres.getHost(),
  port: parseInt(databaseCfgForPostgres.getPort()),
  username: databaseCfgForPostgres.getUsername(),
  password: databaseCfgForPostgres.getPassword(),
  database: databaseCfgForPostgres.getDatabase(),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
export { databaseCfgForPostgres };