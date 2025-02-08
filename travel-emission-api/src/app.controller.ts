import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import {
  GetCO2EmissionSinglePersonDto, AddTravelRecordByOriginAndDestDto,
  GetCO2EmissionPerDateRangeDto, 
  AddTravelRecordByDistanceDto} from './dto/travel-emission.dto';
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
    @Query(new ValidationPipe({ transform: true })) paramDto: GetCO2EmissionSinglePersonDto,
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
    @Query(new ValidationPipe({ transform: true })) paramDto: GetCO2EmissionPerDateRangeDto,
  ): Promise<number> {
    const result = await this.appService.getCO2EmissionKgPerDateRange(paramDto);
    return result;
  }

  @Get('addTravelRecordByOriginAndDestAsGet')
  @ApiOperation({
    summary: `Add travel record. An entry includes company name, starting point, destination, 
    means of transportation and travel date.
    This method is called as a GET request, so the parameters are passed in the URL.` })
  @ApiResponse({
    status: 200, description: 'Returns OK if the operation was successful', 
    schema: { type: 'string',}
  })
  async addTravelRecordByOriginAndDestAsGet(
    @Query(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByOriginAndDestDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    return this.appService.addTravelRecordByOriginAndDst(paramDto);
  }


  @Post('addTravelRecordByOriginAndDest')
  @ApiOperation({
    summary: `Add travel record. An entry includes company name, starting point, destination, 
    means of transportation and travel date.` })
  @ApiResponse({
    status: 201, description: 'Travel record added successfully', 
    schema: { type: 'number',}
  })
  async addTravelRecordByOriginAndDest(
    @Body(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByOriginAndDestDto,
  ) {
    console.log("paramDto: ", paramDto);
    this.appService.addTravelRecordByOriginAndDst(paramDto);
  }


  @Post('addTravelRecordByDistance')
  @ApiOperation({
    summary: `Add travel record. An entry includes company name, travel distance, 
    means of transportation and travel date.` })
  @ApiResponse({
    status: 201, description: 'Travel record added successfully', 
    schema: { type: 'number',}
  })
  async addTravelRecordByDistance(
    @Body(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByDistanceDto,
  ) {
    console.log("paramDto: ", paramDto);
    this.appService.addTravelRecordByDistance(paramDto);
  }

}
