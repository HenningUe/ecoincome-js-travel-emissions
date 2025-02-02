import { Test, TestingModule } from '@nestjs/testing';
import { TravelEmissionService } from './travel-emission.service';
import { getCO2EmissionDto, TransportationMode } from './travel-emission.dto';


const dotenv = require('dotenv');
dotenv.config();
const GOOGLE_MAPS_API_KEY: string = <string>process.env.GOOGLE_MAPS_API_KEY;

describe('TravelEmissionService', () => {
  let service: TravelEmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelEmissionService],
    }).compile();

    service = module.get<TravelEmissionService>(TravelEmissionService);
  });

  it('getCO2EmissionKgTotalPerPerson', async () => {    
    let paramDto = new getCO2EmissionDto(TransportationMode.Car, "munich", "paris");
    const emission = await service.getCO2EmissionKgTotalPerPerson(paramDto);
    expect(emission).toBe(143.1);
  });
});
