import { Controller, Get, Param, Body } from '@nestjs/common';
import { TravelEmissionService } from './travel-emission.service';
import { TransportationMode } from '../../../travel-emission/src/enums';

@Controller('travel-emission')
export class TravelEmissionController {
    constructor(private travelEmissionService: TravelEmissionService) {}
    
    @Get()
    async getCO2EmissionKgTotalPerPerson(@Body() paramDto: getCO2EmissionDto): Promise<string> {
        return this.travelEmissionService.getCO2EmissionKgTotalPerPerson(
            paramDto.TransportationMode, paramDto.origin, paramDto.destination);
    }
    
    @Get()
    getAvailableTransportationModes(): string {
      return this.appService.getAvailableTransportationModes();
    }
}


export class getCO2EmissionDto {
    TransportationMode: TransportationMode;
    origin: string;
    destination: string;
  }