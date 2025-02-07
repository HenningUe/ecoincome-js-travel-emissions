import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { getCO2EmissionDto } from './travel-emission.dto';

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
}
