import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getCO2EmissionKgTotalPerPerson(): string {
    return 'Hello World!';
  }
  getAvailableTransportationModes(): string {
    return 'Hello World!';
  }
}
