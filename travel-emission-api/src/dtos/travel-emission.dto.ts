
/**
 * Modules hosts the DTOs (Data Transfer Objects) used by the TravelRecordsService and EmissionsService.
 * DTOs are used to define the structure of the data that is passed between the client and the server.
 * They are used to validate the data and to serialize it.
 */

import { IsEnum, IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '@app/travel-emission-calc';
import { getEnumAsString } from '@app/enum-helper';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export { TransportationMode };


export class GetCO2EmissionSinglePersonDto {
    /**
    * DTO for the query parameters of the getCO2EmissionKgTotalPerPerson method.
    * See parameter description to get an idea of the data needed for the query.
    */
    @ApiProperty({
      enum: TransportationMode,
      description: 'Used transportation mode',
    })
    @IsEnum(TransportationMode,
      { message: `transportationMode must be one of: ${TransportationModeUtils.getAsString()}` })
    transportationMode: TransportationMode;

    @ApiProperty({
      description: 'The origin of the trip',
    })
    @IsString()
    origin: string;

    @ApiProperty({
      description: 'The destination of the trip',
    })
    @IsString()
    destination: string;
    
    constructor(
      transportationMode: TransportationMode,
      origin: string,
      destination: string,
    ) {
      this.transportationMode = transportationMode;
      this.origin = origin;
      this.destination = destination;
    }
  }

  
export class GetEmissionCO2PerDateRangeDto {
  /**
   * Base-class DTO for the query parameters of the getEmissionCO2KgPerDateRange(...)-methods
   * See child-classes for additional parameters.
   * See parameter description to get an idea of the data needed for the query.
   */
  @ApiProperty({
    description: 'Company name',
  })
  @IsString()
  company: string;
  
  @ApiProperty({
    enum: TransportationMode,
    required: false,
    description: 'Used transportation mode',
  })
  @IsOptional()
  @IsEnum(TransportationMode,
    { message: `transportationMode must be one of: ${TransportationModeUtils.getAsString()}` })
  transportationMode: TransportationMode | undefined = undefined;
  
  @ApiProperty({
    type: Date,
    required: false,
    description: 'Date range start. Format: YYYY-MM-DD. Leave empty for no start date.',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  dateBegin: Date | undefined = undefined;
  
  @ApiProperty({
    type: Date,
    required: false,
    description: 'Date range end. Format: YYYY-MM-DD. Leave empty for no end date.',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  dateEnd: Date | undefined = undefined;
  
  constructor(
    company: string,
    transportationMode: TransportationMode | undefined = undefined,
    dateBegin: Date | undefined = undefined,
    dateEnd: Date | undefined = undefined,
  ) {
    this.company = company;
    this.transportationMode = transportationMode;
    this.dateBegin = dateBegin;
    this.dateEnd = dateEnd;
  }
}


export enum DatePeriodUnit {
  /**
   * Enum for the time intervals in which the time related data is to be aggregated (grouped).
   */
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}


export class GetCO2EmissionAggregatedPerDateRangeDto extends GetEmissionCO2PerDateRangeDto{
  /**
   * DTO for the query parameters of the getEmissionCO2InKgPerDateRange method.
   * See parameter description to get an idea of the data needed for the query.
   */
  @ApiProperty({
    enum: DatePeriodUnit,
    required: true,
    description: 'Defines the time intervals in which the data is to be aggregated',
  })
  @IsEnum(DatePeriodUnit,
    { message: `datePeriodUnit must be one of: ${getEnumAsString(DatePeriodUnit)}` })
  datePeriodUnit: DatePeriodUnit;
  
  
  constructor(
    company: string,
    datePeriodUnit: DatePeriodUnit,
    transportationMode: TransportationMode | undefined = undefined,
    dateBegin: Date | undefined = undefined,
    dateEnd: Date | undefined = undefined,
  ) {
    super(company, transportationMode, dateBegin, dateEnd);
    this.datePeriodUnit = datePeriodUnit;
  }
}


export class GetEmissionCO2PerDateRangeAggregatedResponseDto {
  /**
   * DTO for the response of the getEmissionCO2InKgAggregatedPerDateRange method.
   * See parameter description to get an idea of the data returned by the query.
   */

  @ApiProperty({
    type: Date,
    description: 'Interval start date. Format: YYYY-MM-DD.',
  })
  @Type(() => Date)
  intervalDateBegin: Date;


  @ApiProperty({
    description: 'CO2-emissions in kg emitted during the interval',
  })
  emissionCo2InKg: number;
  
  constructor(
    intervalDateBegin: Date,
    co2EmissionInKg: number,
  ) {
    this.intervalDateBegin = intervalDateBegin;
    this.emissionCo2InKg = co2EmissionInKg;
  }
}



class AddTravelRecordDtoBase {
  /**
   * Base-class DTO for the PUT parameters of the addTravelRecordBy(...)-methods
   * See child-classes for additional parameters.
   * See parameter description to get an idea of the data needed for the query.
   */

  @ApiProperty({
    description: 'Company name',
  })
  @IsString()
  company: string;

  @ApiProperty({
    enum: TransportationMode,
    description: 'Used transportation mode',
  })
  @IsEnum(TransportationMode,
    { message: `transportationMode must be one of: ${TransportationModeUtils.getAsString()}` })
  transportationMode: TransportationMode;

  @ApiProperty({
    type: Date,
    description: 'Date of travel. Format: YYYY-MM-DD',
  })
  @Type(() => Date)
  @IsDate()
  travelDate: Date;
  
  constructor(
    transportationMode: TransportationMode,
    company: string,
    travelDate: Date,
  ) {
    this.transportationMode = transportationMode;
    this.company = company;
    this.travelDate = travelDate;
  }
}

  
export class AddTravelRecordByOriginAndDestDto extends AddTravelRecordDtoBase{
  /**
   * DTO for the PUT-parameters of the addTravelRecordByOriginAndDest method.
   * See parameter description to get an idea of the data needed for the query.
   */
  
  @ApiProperty({
    description: 'The origin of the trip',
  })
  @IsString()
  origin: string;

  @ApiProperty({
    description: 'The destination of the trip',
  })
  @IsString()
  destination: string;
  
  constructor(
    company: string,
    transportationMode: TransportationMode,
    travelDate: Date,
    origin: string,
    destination: string,
  ) {
    super(transportationMode, company, travelDate);
    this.origin = origin;
    this.destination = destination;
  }
}

  
/**
 * DTO for the PUT-parameters of the addTravelRecordByDistance method.
 * See parameter description to get an idea of the data needed for the query.
 */
export class AddTravelRecordByDistanceDto extends AddTravelRecordDtoBase{
  
  @ApiProperty({
    description: 'The distance of the trip',
  })
  @Type(() => Number)
  @IsNumber()
  distance: number;
  
  constructor(
    company: string,
    transportationMode: TransportationMode,
    travelDate: Date,
    distance: number,
  ) {
    super(transportationMode, company, travelDate);
    this.distance = distance;
  }
}