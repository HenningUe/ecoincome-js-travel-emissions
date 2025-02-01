import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getCO2EmissionKgTotalPerPerson(): string {
    return this.appService.getCO2EmissionKgTotalPerPerson();
  }
  getAvailableTransportationModes(): string {
    return this.appService.getAvailableTransportationModes();
  }
}
