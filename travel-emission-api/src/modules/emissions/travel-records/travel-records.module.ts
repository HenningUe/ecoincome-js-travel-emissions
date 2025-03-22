import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForPostgres } from '../../../database/configs/postgres-database.config';

import { CompanyEntity, TravelRecordEntity } from '../../../database/entities/travel-emission.entity';
import { TravelRecordsService } from './travel-records.service';
import { TravelRecordsController } from './travel-records.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, TravelRecordEntity]),
  ],
  providers: [TravelRecordsService],
  controllers: [TravelRecordsController]
})
export class TravelRecordsModule {
  /**
   * As for NestJs in general, the module container for all emissions-related services, controllers and resources.
   * Related dependencies are defined here and injected accordingly by the framework.
   */
}
