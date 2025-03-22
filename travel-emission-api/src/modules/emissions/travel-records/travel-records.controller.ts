import { Controller,  Post, Body,  ValidationPipe, Get, Query } from '@nestjs/common';
import {
  AddTravelRecordByOriginAndDestDto,
  AddTravelRecordByDistanceDto} from '../../../dtos/travel-emission.dto';
  import { TravelRecordsService } from './travel-records.service';
import {  ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('emissions/travel-records')
@Controller('emissions/travel-records')
export class TravelRecordsController {
  /**
   * Handling all travel-related requests, e.g. emissions due to travel, to the /emissions/travel-records endpoint.
   * Requests are PUT methods to add new travel-records (causing CO2 emissions)
   * 
   * @param travelRecordsService - The service hosting the business logic, i.e. mainly database interactions.
   */

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
  
    @Get('debug-by-origin-and-destination-as-get')
    @ApiOperation({
      summary: `For debugging only! Facilitates adding travel records via OpenAPI generated 
      Web-interface. For additional information. See API-description "by-origin-and-destination"` })  
    @ApiOkResponse({
      description: 'Travel record added successfully', 
    })
    async addTravelRecordByOriginAndDestAsGet(
      @Query(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByOriginAndDestDto,
    ) {
      console.log("paramDto: ", paramDto);
      await this.travelRecordsService.addTravelRecordByOriginAndDst(paramDto);
    }
  
    @Get('debug-by-distance-as-get')
    @ApiOperation({
      summary: `For debugging only! Facilitates adding travel records via OpenAPI generated 
      Web-interface. For additional information. See API-description "by-origin-and-destination"` })
    @ApiOkResponse({
      description: 'Travel record added successfully', 
    })
    async addTravelRecordByDistanceAsGet(
      @Query(new ValidationPipe({ transform: true })) paramDto: AddTravelRecordByDistanceDto,
    ) {
      console.log("paramDto: ", paramDto);
      await this.travelRecordsService.addTravelRecordByDistance(paramDto);
    }
  
    @Get('debug-get-company-names')
    @ApiOperation({
      summary: `For debugging only! Returns all company names` })
    @ApiOkResponse({
      description: 'successfully retrieved company names', 
    })
    async GetCompanyNames(): Promise<string[]> {
      return await this.travelRecordsService.getCompanyNames();
    }

}
