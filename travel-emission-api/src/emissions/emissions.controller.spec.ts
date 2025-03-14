
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  addMockData,
  createTestModuleBuilder, RepositoryMockStrategy 
} from '../test-utils/modules/emissions.test-utils';

import {
  GetCO2EmissionSinglePersonDto, TransportationMode,
  GetEmissionCO2PerDateRangeDto,
  GetCO2EmissionAggregatedPerDateRangeDto,
  DatePeriodUnit,
} from '../dto/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from '../entities/travel-emission.entity';
import { EmissionsController } from './emissions.controller';
import { EmissionsService} from './emissions.service';


jest.mock('@app/travel-emission-calc')


describe('EmissionsController', () => {
  let controller: EmissionsController;
  let service: EmissionsService;
  let repositoryCompanyMock: Repository<CompanyEntity>;
  let repositoryTravelRecordMock: Repository<TravelRecordEntity>;
  const moduleBuildCfg = {
      repositoryMockStrategy: RepositoryMockStrategy.sqllitememory,
      addController: true,
  }
  beforeEach(async () => {
    const moduleBuilder: TestingModuleBuilder = createTestModuleBuilder(moduleBuildCfg);
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<EmissionsService>(EmissionsService);
    controller = module.get<EmissionsController>(EmissionsController);
    // @ts-ignore
    repositoryCompanyMock = module.get(getRepositoryToken(CompanyEntity));
    repositoryTravelRecordMock = module.get(getRepositoryToken(TravelRecordEntity));
    await addMockData(moduleBuildCfg, repositoryCompanyMock, repositoryTravelRecordMock);
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
    }, 1000000);

    it('getCO2EmissionKgPerDateRange"', async () => {
      const paramDto = new GetEmissionCO2PerDateRangeDto("BMW", TransportationMode.Car);
      const emission = await controller.getCO2EmissionKgPerDateRange(paramDto);
      expect(emission).toBeGreaterThan(99.3);
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeAggregated"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "ecoincome", DatePeriodUnit.Week, TransportationMode.Car);
      const emission = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emission).toBeGreaterThan(99.3);
    }, 1000000);

  });
});
