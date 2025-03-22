import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

require('dotenv').config();

/**
 * Datebase configuration class respresenting the Postgres-Database.
 */
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

  public getPort(): string {
    return "5432";
    //return this.getValue('POSTGRES_PORT', true);
  }
  public getHost(): string {
    return this.getValue('POSTGRES_HOST', true);
  }
  public getUsername(): string {
    return this.getValue('POSTGRES_USER', true);
  }
  public getPassword(): string {
    return this.getValue('POSTGRES_PASSWORD', true);
  }
  public getDatabase(): string {
    return "emissions_db"
    //return this.getValue('POSTGRES_DATABASE', true);
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
      host: this.getHost(),
      port: parseInt(this.getPort()),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getDatabase(),
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
    //'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    //'POSTGRES_DATABASE'
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