import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  addMockData,
  createTestModuleBuilder, RepositoryMockStrategy 
} from '../../test-utils/modules/emissions.test-utils';
import { 
  CompanyEntity, TravelRecordEntity
} from '../../database/entities/travel-emission.entity';

import {
  GetCO2EmissionSinglePersonDto, TransportationMode,
  GetEmissionCO2PerDateRangeDto,
  GetCO2EmissionAggregatedPerDateRangeDto,
  DatePeriodUnit,
} from '../../dtos/travel-emission.dto';
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
      moduleToUse: "emissions",
  }
  beforeEach(async () => {
    const moduleBuilder: TestingModuleBuilder = (
      createTestModuleBuilder(moduleBuildCfg));
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

    it('getCO2EmissionKgPerDateRangeCompanyMissing"', async () => {
      const paramDto = new GetEmissionCO2PerDateRangeDto("CompanyMissing", TransportationMode.Car);
      try {
        await controller.getCO2EmissionKgPerDateRange(paramDto);
        expect(true).toBe(false);
      } catch (e) {
          expect(e.message).toBe("The company 'CompanyMissing' does not exist");
      }
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeTransportationModeMissing"', async () => {
      const paramDto = new GetEmissionCO2PerDateRangeDto(
        "ecoincome", TransportationMode.PlaneDomestic);
      try {
        await controller.getCO2EmissionKgPerDateRange(paramDto);
        expect(true).toBe(false);
      } catch (e) {
          expect(e.message).toContain("no emission records found");
      }
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeAggregatedWeek1"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "ecoincome", DatePeriodUnit.Week, TransportationMode.Car);
      const emissionsGrouped = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emissionsGrouped[1].emissionCo2InKg).toBe(200);
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeAggregatedWeek2"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "ecoincome", DatePeriodUnit.Week, TransportationMode.Car);
      const emissionsGrouped = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emissionsGrouped.length).toBe(20);
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeAggregatedMonthEmission"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "ecoincome", DatePeriodUnit.Month, TransportationMode.Car);
      const emissionsGrouped = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emissionsGrouped[1].emissionCo2InKg).toBe(900);
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeAggregatedMonthSetCount"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "ecoincome", DatePeriodUnit.Month, TransportationMode.Car);
      const emissionsGrouped = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emissionsGrouped.length).toBe(5);
    }, 1000000);

    it('getCO2EmissionKgPerDateRangeAggregatedYear"', async () => {
      const paramDto = new GetCO2EmissionAggregatedPerDateRangeDto(
        "ecoincome", DatePeriodUnit.Year, TransportationMode.Car);
      const emissionsGrouped = await controller.getCO2EmissionKgPerDateRangeAggregated(paramDto);
      expect(emissionsGrouped.length).toBe(1);
    }, 1000000);

  });
});
