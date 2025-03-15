import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForPostgres } from '../../database/configs/postgres-database.config';
import { CompanyEntity, TravelRecordEntity } from '../../database/entities/travel-emission.entity';

import { EmissionsService } from './emissions.service';
import { EmissionsController } from './emissions.controller';
import { TravelRecordsModule } from './travel-records/travel-records.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
    TypeOrmModule.forFeature([CompanyEntity, TravelRecordEntity]),
    TravelRecordsModule
  ],
  providers: [EmissionsService],
  controllers: [EmissionsController],
})
export class EmissionsModule {}
