import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseCfgForPostgres } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { Company, TravelRecord } from './entities/travel-emission.entity';
import {TravelRecordRepository, CompanyRepository} from './app.service';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Company, TravelRecord]),
  ],
  controllers: [AppController],
  providers: [AppService, TravelRecordRepository, CompanyRepository],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}