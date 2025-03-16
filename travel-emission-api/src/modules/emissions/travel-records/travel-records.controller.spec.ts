import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { 
  addMockData,
  createTestModuleBuilder, RepositoryMockStrategy 
} from '../../../test-utils/modules/emissions.test-utils';
import { 
  CompanyEntity, TravelRecordEntity 
} from '../../../database/entities/travel-emission.entity';
import {
  TransportationMode,
  AddTravelRecordByOriginAndDestDto,
  AddTravelRecordByDistanceDto,
} from '../../dto/travel-emission.dto';
import { TravelRecordsController } from './travel-records.controller';
import { TravelRecordsService} from './travel-records.service';


describe('TravelRecordsController', () => {
  let controller: TravelRecordsController;
  let service: TravelRecordsService;
  let repositoryCompanyMock: Repository<CompanyEntity>;
  let repositoryTravelRecordMock: Repository<TravelRecordEntity>;
  const moduleBuildCfg = {
      repositoryMockStrategy: RepositoryMockStrategy.sqllitememory,
      addController: true,
      moduleToUse: "travel-records",
  }
  beforeEach(async () => {
    const moduleBuilder: TestingModuleBuilder = (
      createTestModuleBuilder(moduleBuildCfg));
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<TravelRecordsService>(TravelRecordsService);
    controller = module.get<TravelRecordsController>(TravelRecordsController);
    // @ts-ignore
    repositoryCompanyMock = module.get(getRepositoryToken(CompanyEntity));
    repositoryTravelRecordMock = module.get(getRepositoryToken(TravelRecordEntity));
    await addMockData(moduleBuildCfg, repositoryCompanyMock, repositoryTravelRecordMock);
  });

  describe('travel-emission', () => {
    it('addTravelRecordByOriginAndDest"', async () => {
      const paramDto: AddTravelRecordByOriginAndDestDto = {
        origin: "munich",
        destination: "berlin",
        transportationMode: TransportationMode.Car,
        company: "newCompany",
        travelDate: new Date("2021-11-10"),
      };
      const result = await controller.addTravelRecordByOriginAndDest(paramDto);
      expect(result).toBe(undefined);
      
      const company = await repositoryCompanyMock.findOne({
        where: { name: "newCompany"},
        relations: ["travelRecords"]});
      expect(company?.travelRecords.length).toBe(1)

    }, 1000000);

    it('addTravelRecordByDistance"', async () => {
      const paramDto: AddTravelRecordByDistanceDto = {
        distance: 300,
        transportationMode: TransportationMode.PublicTransit,
        company: "newCompany2",
        travelDate: new Date("2021-11-10"),
      };
      const result = await controller.addTravelRecordByDistance(paramDto);
      expect(result).toBe(undefined);
      
      const company = await repositoryCompanyMock.findOne({
        where: { name: "newCompany2"},
        relations: ["travelRecords"]});
      expect(company?.travelRecords.length).toBe(1)
      expect(company?.travelRecords[0].emissionCO2).toBeGreaterThan(15)

    }, 1000000);

  });
});
