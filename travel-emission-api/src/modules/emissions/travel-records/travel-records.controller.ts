import { Controller,  Post, Body,  ValidationPipe, Get, Query } from '@nestjs/common';
import {
  AddTravelRecordByOriginAndDestDto,
  AddTravelRecordByDistanceDto} from '../../../dtos/travel-emission.dto';
  import { TravelRecordsService } from './travel-records.service';
import {  ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('emissions/travel-records')
@Controller('emissions/travel-records')
export class TravelRecordsController {

  constructor(private readonly travelRecordsService: TravelRecordsService) {}
  
    @Post('by-origin-and-destination')
    @ApiOperation({
      summary: `Add travel record. An entry includes company name, starting point, destination, 
      means of transportation and travel date.` })
    @ApiCreatedResponse({
      description: 'Travel record added successfully'
    })
    async addTravelRecordByOriginAndDest(
      @Body(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByOriginAndDestDto,
    ) {
      console.log("paramDto: ", paramDto);
      await this.travelRecordsService.addTravelRecordByOriginAndDst(paramDto);
    }
  
    @Post('by-distance')
    @ApiOperation({
      summary: `Add travel record. An entry includes company name, travel distance, 
      means of transportation and travel date.` })
    @ApiCreatedResponse({
      description: 'Travel record added successfully', 
      schema: { type: 'number',}
    })
    async addTravelRecordByDistance(
      @Body(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByDistanceDto,
    ) {
      console.log("paramDto: ", paramDto);
      await this.travelRecordsService.addTravelRecordByDistance(paramDto);
    }
  
    @Get('by-origin-and-destination-as-get')
    @ApiOperation({
      summary: `For debug only: Facilitates adding travel records. See API-description "by-origin-and-destination"
      for additional information.` })  
    @ApiOkResponse({
      description: 'Travel record added successfully', 
    })
    async addTravelRecordByOriginAndDestAsGet(
      @Query(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByOriginAndDestDto,
    ) {
      console.log("paramDto: ", paramDto);
      await this.travelRecordsService.addTravelRecordByOriginAndDst(paramDto);
    }
  
    @Post('by-distance-as-get')
    @ApiOperation({
      summary: `For debug only: Facilitates adding travel records. See API-description "by-distance"
      for additional information.` })
      @ApiOkResponse({
        description: 'Travel record added successfully', 
      })
    async addTravelRecordByDistanceAsGet(
      @Query(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByDistanceDto,
    ) {
      console.log("paramDto: ", paramDto);
      await this.travelRecordsService.addTravelRecordByDistance(paramDto);
    }

}
