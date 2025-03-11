
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {  ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmissionsService } from './emissions.service';
import { GetCO2EmissionPerDateRangeDto, GetCO2EmissionSinglePersonDto } from './../dto/travel-emission.dto';


@ApiTags('emissions')
@Controller('emissions')
export class EmissionsController {

    constructor(private readonly emissionsService: EmissionsService) {}
  
    @Get('per-person-in-kg-co2')
    @ApiOperation({
        summary: `Calculates CO2 emissions for trips from the origin to the destination per person
        The distance is determined automatically. Depending on the means of transportation, 
        different CO2/km emissions are assumed.` })
        @ApiResponse({
        status: 200, description: 'CO2 emission in kg per person', 
        schema: { type: 'number',}
        })
    async getCO2EmissionKgTotalPerPerson(
        @Query(new ValidationPipe({ transform: true })) paramDto: GetCO2EmissionSinglePersonDto,
    ): Promise<number> {
        const result = await this.emissionsService.getCO2EmissionKgTotalPerPerson(paramDto);
        return result;
    }

    @Get('per-date-range-in-kg-co2')
    @ApiOperation({
        summary: `Calculates CO2 emissions for trips from the origin to the destination
        for a given date range, company and transportation mode.
        The distance is determined automatically. Depending on the means of transportation, 
        different CO2/km emissions are assumed.` })
    @ApiResponse({
        status: 200, description: 'CO2 emission in kg per person', 
        schema: { type: 'number',}
    })
    async getCO2EmissionKgPerDateRange(
        @Query(new ValidationPipe({ transform: true })) paramDto: GetCO2EmissionPerDateRangeDto,
    ): Promise<number> {
        const result = await this.emissionsService.getCO2EmissionKgPerDateRange(paramDto);
        return result;
    }
}
