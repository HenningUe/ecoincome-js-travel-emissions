import { Controller, Get, Req, Query, ValidationPipe, Body } from '@nestjs/common';
import { TravelEmissionService } from './travel-emission.service';
import { getCO2EmissionDto } from './travel-emission.dto';

@Controller('travel-emission')
export class TravelEmissionController {
    constructor(private travelEmissionService: TravelEmissionService) {}
    
    @Get(':getCO2EmissionKgTotalPerPerson')
    async getCO2EmissionKgTotalPerPerson(
        @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionDto): Promise<number> {
        return this.travelEmissionService.getCO2EmissionKgTotalPerPerson(paramDto);
    }
    
}
