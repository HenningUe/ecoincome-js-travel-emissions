import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getCO2EmissionDto, TransportationMode } from './travel-emission.dto';

import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForPostgres } from './config/typeorm.config';

import { Company } from './entities/travel-emission.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(databaseCfgForPostgres.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Company]),
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
    }, 100000);
  });
});
