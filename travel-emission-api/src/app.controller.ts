import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import {
  getCO2EmissionSinglePersonDto, addTravelRecordDto,
  getCO2EmissionPerDateRangeDto } from './dto/travel-emission.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getCO2EmissionKgTotalPerPerson')
  /**
   * Calculates CO2 emissions for trips from the origin to the destination per person
   * The distance is determined automatically. Depending on the means of transportation, 
   * different CO2/km emissions are assumed.
   * @param paramDto getCO2EmissionSinglePersonDto The object containing the parameters
   * @returns A string with the total CO2 emission in kg
   */
  async getCO2EmissionKgTotalPerPerson(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionSinglePersonDto,
  ): Promise<string> {
    const result = await this.appService.getCO2EmissionKgTotalPerPerson(paramDto);
    return String(result);
  }


  @Get('getCO2EmissionKgPerDateRange')
  /**
   * Calculates CO2 emissions for trips from the origin to the destination
   * for a given date range, company and transportation mode.
   * The distance is determined automatically. Depending on the means of transportation, 
   * different CO2/km emissions are assumed.
   * @param paramDto getCO2EmissionPerDateRangeDto The object containing the parameters
   * @returns A string with the total CO2 emission in kg
   */
  async getCO2EmissionKgPerDateRange(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionPerDateRangeDto,
  ): Promise<string> {
    const result = await this.appService.getCO2EmissionKgPerDateRange(paramDto);
    return String(result);
  }

  @Get('addTravelRecordAsGet')
  /**
   * Add travel record. An entry includes company name, starting point, destination, means of transportation and travel date.
   * This method is called as a GET request, so the parameters are passed in the URL.
   * @param paramDto addTravelRecordDto The object containing the parameters
   * @returns A string with the result of the operation
   */
  async addTravelRecordAsGet(
    @Query(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    return this.appService.addTravelRecord(paramDto);
  }


  @Post('addTravelRecord')
  /**
   * Add travel record. An entry includes company name, starting point, destination, means of transportation and travel date.
   * @param paramDto addTravelRecordDto The object containing the parameters
   * @returns A string with the result of the operation
   */
  async addTravelRecord(
    @Body(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    return this.appService.addTravelRecord(paramDto);
  }

}
