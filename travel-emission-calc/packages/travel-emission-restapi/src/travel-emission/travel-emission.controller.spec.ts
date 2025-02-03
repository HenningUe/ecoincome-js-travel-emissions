import { Test, TestingModule } from '@nestjs/testing';
import { TravelEmissionController } from './travel-emission.controller';
import { TravelEmissionService } from './travel-emission.service';
import { getCO2EmissionDto, TransportationMode } from './travel-emission.dto';
import '../../test/_test-common'


describe('TravelEmissionController', () => {
  let controller: TravelEmissionController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TravelEmissionController],
      providers: [TravelEmissionService],
    }).compile();

    controller = moduleRef.get(TravelEmissionController);
  });
  
  test('getCO2EmissionKgTotalPerPerson', async () => {    
    let paramDto = new getCO2EmissionDto(TransportationMode.Car, "munich", "paris");
    const emission = await controller.getCO2EmissionKgTotalPerPerson(paramDto);
    expect(emission).toBe(143.1);
  });
});
