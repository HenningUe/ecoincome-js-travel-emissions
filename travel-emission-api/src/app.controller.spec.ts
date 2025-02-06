import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { databaseCfgForPostgres } from './config/typeorm.config';
import { getCO2EmissionDto, TransportationMode, addTravelRecordDto } from './travel-emission.dto';
import { Company, TravelRecord } from './entities/travel-emission.entity';
import {TravelRecordRepository, CompanyRepository} from './app.service';


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
        TypeOrmModule.forFeature([TravelRecordRepository, CompanyRepository, Company, TravelRecord]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('getCO2EmissionKgTotalPerPerson"', async () => {
      const paramDto: getCO2EmissionDto = {
        origin: "munich",
        destination: "berlin",
        transportationMode: TransportationMode.Car,
      };
      const emission = await appController.getCO2EmissionKgTotalPerPerson(paramDto);
      expect(emission).toBe("99.3");
    },
  );
  it('getCO2EmissionKgTotalPerPerson"', async () => {
    const paramDto: addTravelRecordDto = {
      origin: "munich",
      destination: "berlin",
      transportationMode: TransportationMode.Car,
      company: "BMW",
      travelDate: new Date("2021-09-01"),
    };
    const emission = await appController.addTravelRecord(paramDto);
    expect(emission).toBe("99.3");
  },
);
  });
});
