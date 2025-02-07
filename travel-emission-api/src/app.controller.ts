import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import {
  getCO2EmissionSinglePersonDto, addTravelRecordDto,
  getCO2EmissionPerDateRangeDto } from './dto/travel-emission.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getCO2EmissionKgTotalPerPerson')
  async getCO2EmissionKgTotalPerPerson(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionSinglePersonDto,
  ): Promise<string> {
    const result = await this.appService.getCO2EmissionKgTotalPerPerson(paramDto);
    return String(result);
  }


  @Get('getCO2EmissionKgPerDateRange')
  async getCO2EmissionKgPerDateRange(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionPerDateRangeDto,
  ): Promise<string> {
    const result = await this.appService.getCO2EmissionKgPerDateRange(paramDto);
    return String(result);
  }

  @Get('addTravelRecordAsGet')
  async addTravelRecordAsGet(
    @Query(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    return this.appService.addTravelRecord(paramDto);
  }


  @Post('addTravelRecord')
  async addTravelRecord(
    @Body(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    return this.appService.addTravelRecord(paramDto);
  }

}
