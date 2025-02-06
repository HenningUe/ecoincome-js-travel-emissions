import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { databaseCfgForPostgres } from './config/typeorm.config';
import { getCO2EmissionDto, TransportationMode, addTravelRecordDto } from './travel-emission.dto';
import { Company, TravelRecord } from './entities/travel-emission.entity';
import {TravelRecordRepository, CompanyRepository} from './app.service';
import { timeout } from 'rxjs';


describe('AppController', () => {
  let appController: AppController;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Company, TravelRecord]),
      ],
      controllers: [AppController],
      providers: [AppService, TravelRecordRepository, CompanyRepository],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    //await connection.destroy();
    await app.close(); //
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
    }, 100000);
  it('addTravelRecord"', async () => {
     const paramDto: addTravelRecordDto = {
      origin: "munich",
      destination: "berlin",
      transportationMode: TransportationMode.Car,
      company: "BMW",
      travelDate: new Date("2021-09-01"),
    };
    const emission = await appController.addTravelRecord(paramDto);
    expect(emission).toBe("99.3");
    }, 100000);
  });

});
