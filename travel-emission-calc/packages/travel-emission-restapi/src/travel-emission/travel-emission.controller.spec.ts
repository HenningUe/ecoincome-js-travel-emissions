import { Test, TestingModule } from '@nestjs/testing';
import { TravelEmissionController } from './travel-emission.controller';
import { getCO2EmissionDto, TransportationMode } from './travel-emission.dto';
import { TravelEmissionService } from './travel-emission.service';
import { describe, it, test, expect, beforeEach } from 'vitest';

describe('TravelEmissionController', () => {
  let controller: TravelEmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelEmissionController],
    }).compile();

    controller = module.get<TravelEmissionController>(TravelEmissionController);
  });
  
  test('getCO2EmissionKgTotalPerPerson', async () => {    
    let paramDto = new getCO2EmissionDto(TransportationMode.Car, "munich", "paris");
    const emission = await controller.getCO2EmissionKgTotalPerPerson(paramDto);
    expect(emission).toBe(143.1);
  });
});
