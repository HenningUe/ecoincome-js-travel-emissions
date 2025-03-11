import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  GetCO2EmissionSinglePersonDto, TransportationMode,
  GetCO2EmissionPerDateRangeDto,
} from './..//dto/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from './../entities/travel-emission.entity';
import { MockFactory } from '../entities/travel-emission.entity.mockup';

import { EmissionsController } from './emissions.controller';
import { EmissionsService} from './emissions.service';
import { Repository } from 'typeorm';


describe('EmissionsController', () => {
  let controller: EmissionsController;
  let service: EmissionsService;
  let repositoryCompanyMock: Repository<CompanyEntity>;
  let repositoryTravelRecordMock: Repository<TravelRecordEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [EmissionsController],
      providers: [
        EmissionsService,
        { provide: getRepositoryToken(CompanyEntity), useExisting: false}, 
        { provide: getRepositoryToken(TravelRecordEntity), useExisting: false},
      ],
    })
    //this is for overriding a provider that exists in a module already (such as the ProjectsModule)
    .overrideProvider(getRepositoryToken(CompanyEntity))
    .useFactory({
        factory: MockFactory.createCompanyRepositoryMock()
    })
    .overrideProvider(getRepositoryToken(TravelRecordEntity))
    .useFactory({
        factory: MockFactory.createTravelRecordRepositoryMock()
    })
    
    .compile();

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
      expect(emission).toBe("99.3");
    }, 100000);

    it('getCO2EmissionPerDateRangeDto"', async () => {
      const paramDto = new GetCO2EmissionPerDateRangeDto("BMW", TransportationMode.Car);
      const emission = await controller.getCO2EmissionKgPerDateRange(paramDto);
      expect(emission).toBeGreaterThan(99.3);
    }, 100000);
  });
});
