
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetCO2EmissionSinglePersonDto, TransportationMode,
  GetCO2EmissionPerDateRangeDto,
  GetCO2EmissionAggregatedPerDateRangeDto,
  DateAggregationUnit,
} from './../dto/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from './../entities/travel-emission.entity';

import { EmissionsController } from './emissions.controller';
import { EmissionsService} from './emissions.service';
import { createTestModuleBuilder } from './emissions.test-helper';


jest.mock('@app/travel-emission-calc')


describe('EmissionsController', () => {
  let controller: EmissionsController;
  let service: EmissionsService;
  let repositoryCompanyMock: Repository<CompanyEntity>;
  let repositoryTravelRecordMock: Repository<TravelRecordEntity>;

  beforeEach(async () => {
    const moduleBuilder: TestingModuleBuilder = createTestModuleBuilder(true);
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<EmissionsService>(EmissionsService);
    repositoryCompanyMock = module.get(getRepositoryToken(CompanyEntity));
    repositoryTravelRecordMock = module.get(getRepositoryToken(TravelRecordEntity));
    controller = module.get<EmissionsController>(EmissionsController);
  });

  describe('travel-emission', () => {
    it('getCO2EmissionKgTotalPerPerson"', async () => {
      const paramDto: GetCO2EmissionSinglePersonDto = {
        origin: "munich",
        destination: "berlin",
        transportationMode: TransportationMode.Car,
      };
      const emission = await controller.getCO2EmissionKgTotalPerPerson(paramDto);
      expect(emission).toBeCloseTo(100);
    }, 100000);

    it('getCO2EmissionKgPerDateRange"', async () => {
      const paramDto = new GetCO2EmissionPerDateRangeDto("BMW", TransportationMode.Car);
      const emission = await controller.getCO2EmissionKgPerDateRange(paramDto);
      expect(emission).toBeGreaterThan(99.3);
    }, 100000);

    it('getCO2EmissionKgPerDateRangeAggregated"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "BMW", DateAggregationUnit.Week, TransportationMode.Car);
      const emission = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emission).toBeGreaterThan(99.3);
    }, 100000);

  });
});
