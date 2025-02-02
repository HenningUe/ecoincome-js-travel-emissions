import { Injectable } from '@nestjs/common';
//import { getCO2EmissionKgTotalPerPerson,  } from '@travel-emission-calc/travel-emission';
import { getCO2EmissionKgTotalPerPerson } from '../../../travel-emission/src/index';
import { getCO2EmissionDto } from './travel-emission.dto';

@Injectable()
export class TravelEmissionService {
  
  async getCO2EmissionKgTotalPerPerson(
    paramDto: getCO2EmissionDto): Promise<number> {
    return getCO2EmissionKgTotalPerPerson(
      paramDto.TransportationMode, paramDto.origin, paramDto.destination);
  }
}


