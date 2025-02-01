import { Injectable } from '@nestjs/common';
import { getCO2EmissionKgTotalPerPerson } from '../../../travel-emission';

@Injectable()
export class TravelEmissionService {
  
  getCO2EmissionKgTotalPerPerson(
    transportMode: string,
    origin: string,
    destination: string,
  ): string {
    return getCO2EmissionKgTotalPerPerson(transportMode, origin, destination);
  }
  getAvailableTransportationModes(): string {
    return 'Hello World!';
  }
}