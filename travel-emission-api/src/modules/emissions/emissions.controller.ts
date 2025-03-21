
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {  ApiNotFoundResponse, ApiOperation, ApiTags, ApiOkResponse, ApiNoContentResponse, getSchemaPath } from '@nestjs/swagger';
import { EmissionsService } from './emissions.service';
import { GetCO2EmissionAggregatedPerDateRangeDto, GetEmissionCO2PerDateRangeAggregatedResponseDto,
    GetEmissionCO2PerDateRangeDto, GetCO2EmissionSinglePersonDto,
 } from '../../dtos/travel-emission.dto';


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
        const result = await this.emissionsService.getEmissionCO2KgTotalPerPerson(paramDto);
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
    @ApiNoContentResponse({
        description: 'NotFoundException. Company not found',
    })
    @ApiNoContentResponse({
        description: 'NotFoundException. No data found matching given parameters',
    })
    async getCO2EmissionKgPerDateRange(
        @Query(new ValidationPipe({ transform: true })) paramDto: GetEmissionCO2PerDateRangeDto,
    ): Promise<number> {
        const result = await this.emissionsService.getEmissionCO2KgPerDateRange(paramDto);
        return result;
    }

    @Get('per-date-range-aggregated-in-kg-co2')
    @ApiOperation({
        summary: `Calculates CO2 emissions for trips from the origin to the destination
        for a given date range, company and transportation mode.
        CO2 emissions are aggregated (grouped) based on the datePeriodUnit,
        i.e. split into weeks, months or years.
        IMPORTANT: Only records inside the given date-range are taken into account.
        I.e. you must ensure that your date-range start and end dates 
        match the date-period. E.g. for month-periods the most reasonable start-date 
        is the first for respective month.` })
    @ApiOkResponse({
        description: 'CO2 emission in kg per person grouped by datePeriodUnit', 
        type: GetCO2EmissionAggregatedPerDateRangeDto,
        isArray: true,
    })
    @ApiNoContentResponse({
        description: 'NotFoundException. Company not found',
    })
    @ApiNoContentResponse({
        description: 'NotFoundException. No data found matching given parameters',
    })
    async getCO2EmissionKgPerDateRangeAggregated(
        @Query(new ValidationPipe({ transform: true })
    ) paramDto: GetCO2EmissionAggregatedPerDateRangeDto,
    ): Promise<GetEmissionCO2PerDateRangeAggregatedResponseDto[]> {
        const datePeriodUnit = paramDto.datePeriodUnit;
        const paramDto2: GetEmissionCO2PerDateRangeDto = <GetEmissionCO2PerDateRangeDto>paramDto;
        const result = (
            await this.emissionsService.getEmissionCO2InKgAggregatedPerDateRange(
                paramDto2, datePeriodUnit));
        return result;
    }
}


