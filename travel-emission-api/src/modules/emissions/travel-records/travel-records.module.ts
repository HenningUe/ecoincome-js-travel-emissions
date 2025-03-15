import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForPostgres } from '../../../database/configs/postgres-database.config';

import { CompanyEntity, TravelRecordEntity } from '../../../database/entities/travel-emission.entity';
import { TravelRecordsService } from './travel-records.service';
import { TravelRecordsController } from './travel-records.controller';

@Module({
  imports: [
    //TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
    TypeOrmModule.forFeature([CompanyEntity, TravelRecordEntity]),
  ],
  providers: [TravelRecordsService],
  controllers: [TravelRecordsController]
})
export class TravelRecordsModule {}
