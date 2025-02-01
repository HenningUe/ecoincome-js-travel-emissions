import { Injectable } from '@nestjs/common';
import { getCO2EmissionKgTotalPerPerson } from '../../../travel-emission';

@Injectable()
export class TravelEmissionService {
    private readonly resources: MyResource[] = [];
  
    create(
        transportMode: string,
        origin: string,
        destination: string): Promise<number> {
        getCO2EmissionKgTotalPerPerson(GOOGLE_MAPS_API_KEY, transportMode, origin, destination);
  }
}