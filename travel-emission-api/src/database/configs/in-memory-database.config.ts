import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';


export class DatabaseCfg {

  public isProduction(): boolean {
    return false;
  }

  public getTypeOrmConfig(entities: any[] | null=null): TypeOrmModuleOptions {
    let entitiesToApply = ["dist/**/*.entity{.ts,.js}"];
    if (entities != null) {
      entitiesToApply.push(...entities);
    }
    return {
      type: 'sqlite', // 'sqlite', 'better-sqlite3'
      database: 'memory',
      dropSchema: true,
      entities: entitiesToApply,
      migrationsTableName: 'migration',
      migrations: ['src/**/migration/*.ts'],
      migrationsRun: true,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    };
  }


  public getDataSource(entities: any[] | null=null): DataSource {
    let config: DataSourceOptions = this.getTypeOrmConfig(entities) as DataSourceOptions;    
    return new DataSource(config);
  }
}

const databaseCfg = new DatabaseCfg();
  
// let config: DataSourceOptions = databaseCfg.getTypeOrmConfig() as DataSourceOptions;

// const AppDataSource = new DataSource(config);

// AppDataSource = new DataSource({
//   type: 'sqlite',
//   database: 'memory',
//   synchronize: false,
//   entities: ['**/*.entity.ts'],
//   migrations: ['src/database/migrations/*-migration.ts'],
//   migrationsRun: false,
//   logging: true,
// });

//export default AppDataSource;
export { databaseCfg as databaseCfgForSqlLiteInMemory };