import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  TransportationMode,
  AddTravelRecordByOriginAndDestDto,
} from '../../dto/travel-emission.dto';
import { 
  CompanyEntity, TravelRecordEntity 
} from '../../../database/entities/travel-emission.entity';
import { TravelRecordsController } from './travel-records.controller';
import { TravelRecordsService} from './travel-records.service';
import { Repository } from 'typeorm';
import { 
  addMockData, createTestModuleBuilder, RepositoryMockStrategy 
} from '../../../test-utils/modules/emissions.test-utils';


describe('TravelRecordsController', () => {
  let controller: TravelRecordsController;
  let service: TravelRecordsService;
  let repositoryCompanyMock: Repository<CompanyEntity>;
  let repositoryTravelRecordMock: Repository<TravelRecordEntity>;
  const moduleBuildCfg = {
      repositoryMockStrategy: RepositoryMockStrategy.sqllitememory,
      addController: true,
  }
  beforeEach(async () => {
    const moduleBuilder: TestingModuleBuilder = (
      createTestModuleBuilder(moduleBuildCfg, "travel-records"));
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<TravelRecordsService>(TravelRecordsService);
    controller = module.get<TravelRecordsController>(TravelRecordsController);
    // @ts-ignore
    repositoryCompanyMock = module.get(getRepositoryToken(CompanyEntity));
    repositoryTravelRecordMock = module.get(getRepositoryToken(TravelRecordEntity));
    await addMockData(moduleBuildCfg, repositoryCompanyMock, repositoryTravelRecordMock);
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
