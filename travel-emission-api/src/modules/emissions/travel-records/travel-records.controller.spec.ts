
/**
 * Test suite for the TravelRecordsController.
 */

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
} from '../../../dtos/travel-emission.dto';
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
      let paramDto: AddTravelRecordByOriginAndDestDto 
      paramDto = {
        origin: "munich",
        destination: "berlin",
        transportationMode: TransportationMode.Car,
        company: "newCompany",
        travelDate: new Date("2021-11-10"),
      };
      await controller.addTravelRecordByOriginAndDest(paramDto);
      await controller.addTravelRecordByOriginAndDest(paramDto);
      paramDto = {
        origin: "munich",
        destination: "berlin",
        transportationMode: TransportationMode.PublicTransit,
        company: "newCompany3",
        travelDate: new Date("2022-11-10"),
      };
      await controller.addTravelRecordByOriginAndDest(paramDto);
      
      const company = await repositoryCompanyMock.findOne({
        where: { name: "newCompany"},
        relations: ["travelRecords"]});
      expect(company?.travelRecords.length).toBe(2)

    }, 1000000);

    it('addTravelRecordByDistance"', async () => {
      let paramDto: AddTravelRecordByDistanceDto
      paramDto = {
        distance: 300,
        transportationMode: TransportationMode.PublicTransit,
        company: "newCompany2",
        travelDate: new Date("2021-11-10"),
      };
      await controller.addTravelRecordByDistance(paramDto);
      await controller.addTravelRecordByDistance(paramDto);
      await controller.addTravelRecordByDistance(paramDto);
      paramDto = {
        distance: 200,
        transportationMode: TransportationMode.PublicTransit,
        company: "newCompany3",
        travelDate: new Date("2023-11-10"),
      };

      const company = await repositoryCompanyMock.findOne({
        where: { name: "newCompany2"},
        relations: ["travelRecords"]});
      expect(company?.travelRecords.length).toBe(3)
      expect(company?.travelRecords[0].emissionCO2).toBeGreaterThan(15)

    }, 1000000);

  });
});
