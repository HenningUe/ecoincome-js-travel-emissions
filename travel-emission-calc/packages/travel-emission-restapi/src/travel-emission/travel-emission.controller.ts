import { Controller, Get, Query, ValidationPipe, Body } from '@nestjs/common';
import { TransportationMode } from '../../../travel-emission/src/enums';
import { TravelEmissionService } from './travel-emission.service';
import { getCO2EmissionDto } from './travel-emission.dto';

@Controller('travel-emission')
export class TravelEmissionController {
    constructor(private travelEmissionService: TravelEmissionService) {}
    
    @Get()
    async getCO2EmissionKgTotalPerPerson(@Body() paramDto: getCO2EmissionDto): Promise<number> {
        return this.travelEmissionService.getCO2EmissionKgTotalPerPerson(paramDto);
    }
    
}
