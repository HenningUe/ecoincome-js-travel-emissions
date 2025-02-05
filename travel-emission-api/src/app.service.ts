import { Injectable } from '@nestjs/common';
import { getCO2EmissionDto } from './travel-emission.dto';
import {getCO2EmissionKgTotalPerPerson} from '@app/travel-emission-calc';

@Injectable()
export class AppService {

  async getCO2EmissionKgTotalPerPerson(paramDto: getCO2EmissionDto): Promise<number> {
    console.log("paramDto: ", paramDto);
    return getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
  }
}
