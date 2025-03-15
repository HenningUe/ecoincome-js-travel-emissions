import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  TransportationMode,
  AddTravelRecordByOriginAndDestDto,
} from '../../dto/travel-emission.dto';
import { databaseCfgForPostgres } from '../../../database/configs/postgres-database.config';
import { CompanyEntity, TravelRecordEntity } from '../../../database/entities/travel-emission.entity';
import { TravelRecordsController } from './travel-records.controller';
import { TravelRecordsService} from './travel-records.service';


describe('TravelRecordsController', () => {
  let controller: TravelRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelRecordsController],
    }).compile();

    controller = module.get<TravelRecordsController>(TravelRecordsController);
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
        TypeOrmModule.forFeature([CompanyEntity, TravelRecordEntity]),
      ],
      controllers: [TravelRecordsController],
      providers: [TravelRecordsService],
    }).compile();

    controller = app.get<TravelRecordsController>(TravelRecordsController);
  });

  describe('travel-emission', () => {
    it('addTravelRecord"', async () => {
      const paramDto: AddTravelRecordByOriginAndDestDto = {
      origin: "munich",
      destination: "berlin",
      transportationMode: TransportationMode.Car,
      company: "BMW",
      travelDate: new Date("2021-11-10"),
    };
    const result = await controller.addTravelRecordByOriginAndDest(paramDto);
    expect(result).toBe("OK");
    }, 100000);

  });
});
