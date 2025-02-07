import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForPostgres } from './config/typeorm.config';

import { Company, TravelRecord } from './entities/travel-emission.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Company, TravelRecord])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
