
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {  ApiNotFoundResponse, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { EmissionsService } from './emissions.service';
import { GetCO2EmissionAggregatedPerDateRangeDto, GetCO2EmissionAggregatedPerDateRangeResponseDto, GetCO2EmissionPerDateRangeDto, GetCO2EmissionSinglePersonDto } from './../dto/travel-emission.dto';


@ApiTags('emissions')
@Controller('emissions')
export class EmissionsController {

    constructor(private readonly emissionsService: EmissionsService) {}
  
    @Get('per-person-in-kg-co2')
    @ApiOperation({
        summary: `Calculates CO2 emissions for trips from the origin to the destination per person
        The distance is determined automatically. Depending on the means of transportation, 
        different CO2/km emissions are assumed.` })
    @ApiOkResponse({
        description: 'CO2 emission in kg per person', 
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
        for a given date range, company and transportation mode.` })
    @ApiOkResponse({
        description: 'CO2 emission in kg per person', 
        schema: { type: 'number',}
    })
    @ApiNotFoundResponse({
        description: 'NotFoundException. Company not found',
    })
    async getCO2EmissionKgPerDateRange(
        @Query(new ValidationPipe({ transform: true })) paramDto: GetCO2EmissionPerDateRangeDto,
    ): Promise<number> {
        const result = await this.emissionsService.getCO2EmissionKgPerDateRange(paramDto);
        return result;
    }

    @Get('per-date-range-aggregated-in-kg-co2')
    @ApiOperation({
        summary: `Calculates CO2 emissions for trips from the origin to the destination
        for a given date range, company and transportation mode.
        CO2 emissions are aggregated (grouped) based on the dateAggregationUnit,
        i.e. split into weeks, months or years.` })
    @ApiOkResponse({
        description: 'CO2 emission in kg per person grouped by dateAggregationUnit', 
        schema: { type: 'GetCO2EmissionAggregatedPerDateRangeResponseDto[]',}
    })
    @ApiNotFoundResponse({
        description: 'NotFoundException. Company not found',
    })
    async getCO2EmissionKgPerDateRangeAggregated(
        @Query(new ValidationPipe({ transform: true })
    ) paramDto: GetCO2EmissionAggregatedPerDateRangeDto,
    ): Promise<GetCO2EmissionAggregatedPerDateRangeResponseDto[]> {
        const dateAggregationUnit = paramDto.dateAggregationUnit;
        const paramDto2: GetCO2EmissionPerDateRangeDto = <GetCO2EmissionPerDateRangeDto>paramDto;
        const result = (
            await this.emissionsService.getCO2EmissionKgAggregatedPerDateRange(
                paramDto2, dateAggregationUnit));
        return [] //result;
    }
}


