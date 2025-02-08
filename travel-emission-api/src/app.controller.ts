import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import {
  getCO2EmissionSinglePersonDto, addTravelRecordDto,
  getCO2EmissionPerDateRangeDto } from './dto/travel-emission.dto';
import {  ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getCO2EmissionKgTotalPerPerson')
  @ApiOperation({
    summary: `Calculates CO2 emissions for trips from the origin to the destination per person
    The distance is determined automatically. Depending on the means of transportation, 
    different CO2/km emissions are assumed.` })
    @ApiResponse({
      status: 200, description: 'CO2 emission in kg', 
      schema: { type: 'number',}
    })
  async getCO2EmissionKgTotalPerPerson(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionSinglePersonDto,
  ): Promise<number> {
    const result = await this.appService.getCO2EmissionKgTotalPerPerson(paramDto);
    return result;
  }


  @Get('getCO2EmissionKgPerDateRange')
  @ApiOperation({
    summary: `Calculates CO2 emissions for trips from the origin to the destination
    for a given date range, company and transportation mode.
    The distance is determined automatically. Depending on the means of transportation, 
    different CO2/km emissions are assumed.` })
  @ApiResponse({
    status: 200, description: 'CO2 emission in kg', 
    schema: { type: 'number',}
  })
  async getCO2EmissionKgPerDateRange(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionPerDateRangeDto,
  ): Promise<number> {
    const result = await this.appService.getCO2EmissionKgPerDateRange(paramDto);
    return result;
  }

  @Get('addTravelRecordAsGet')
  @ApiOperation({
    summary: `Add travel record. An entry includes company name, starting point, destination, 
    means of transportation and travel date.
    This method is called as a GET request, so the parameters are passed in the URL.` })
  @ApiResponse({
    status: 200, description: 'Returns OK if the operation was successful', 
    schema: { type: 'string',}
  })
  async addTravelRecordAsGet(
    @Query(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    return this.appService.addTravelRecord(paramDto);
  }


  @Post('addTravelRecord')
  @ApiOperation({
    summary: `Add travel record. An entry includes company name, starting point, destination, 
    means of transportation and travel date.` })
  @ApiResponse({
    status: 201, description: 'Travel record added successfully', 
    schema: { type: 'number',}
  })
  async addTravelRecord(
    @Body(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ) {
    console.log("paramDto: ", paramDto);
    this.appService.addTravelRecord(paramDto);
  }

}
