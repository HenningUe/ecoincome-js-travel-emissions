import { Controller, Get, Query, ValidationPipe, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { getCO2EmissionDto, addTravelRecordDto } from './travel-emission.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getCO2EmissionKgTotalPerPerson')
  async getCO2EmissionKgTotalPerPerson(
    @Query(new ValidationPipe({ transform: true })) paramDto: getCO2EmissionDto,
  ): Promise<string> {
    const result = await this.appService.getCO2EmissionKgTotalPerPerson(paramDto);
    return String(result);
  }

  
  @Get('addTravelRecordAsGet')
  async addTravelRecordAsGet(
    @Query(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    await this.appService.addTravelRecord(paramDto);
    return "OK";
  }


  @Post('addTravelRecord')
  async addTravelRecord(
    @Body(new ValidationPipe({ transform: true })) paramDto: addTravelRecordDto,
  ): Promise<string> {
    console.log("paramDto: ", paramDto);
    const result = await this.appService.addTravelRecord(paramDto);
    return String(result);
  }

}
