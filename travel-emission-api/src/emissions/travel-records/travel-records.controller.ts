import { Controller,  Post, Body,  ValidationPipe } from '@nestjs/common';
import {
  AddTravelRecordByOriginAndDestDto,
  AddTravelRecordByDistanceDto} from './../../dto/travel-emission.dto';
  import { TravelRecordsService } from './travel-records.service';
import {  ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('emissions/travel-records')
@Controller('emissions/travel-records')
export class TravelRecordsController {

  constructor(private readonly travelRecordsService: TravelRecordsService) {}
  
    @Post('by-origin-and-destination')
    @ApiOperation({
      summary: `Add travel record. An entry includes company name, starting point, destination, 
      means of transportation and travel date.` })
    @ApiCreatedResponse({
      description: 'Travel record added successfully', 
      schema: { type: 'number',}
    })
    @ApiNotFoundResponse({
      description: 'NotFoundException. Company not found',
    })
    async addTravelRecordByOriginAndDest(
      @Body(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByOriginAndDestDto,
    ) {
      console.log("paramDto: ", paramDto);
      this.travelRecordsService.addTravelRecordByOriginAndDst(paramDto);
    }
  
    @Post('by-distance')
    @ApiOperation({
      summary: `Add travel record. An entry includes company name, travel distance, 
      means of transportation and travel date.` })
    @ApiCreatedResponse({
      description: 'Travel record added successfully', 
      schema: { type: 'number',}
    })
    @ApiNotFoundResponse({
      description: 'NotFoundException. Company not found',
    })
    async addTravelRecordByDistance(
      @Body(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByDistanceDto,
    ) {
      console.log("paramDto: ", paramDto);
      this.travelRecordsService.addTravelRecordByDistance(paramDto);
    }

}
