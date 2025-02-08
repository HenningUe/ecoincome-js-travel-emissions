

import { IsEnum, IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '@app/travel-emission-calc';
import { Company } from '../entities/travel-emission.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export { TransportationMode };


export class GetCO2EmissionSinglePersonDto {
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

  
export class GetCO2EmissionPerDateRangeDto {
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


  
class AddTravelRecordDtoBase {

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

  
export class AddTravelRecordByDistanceDto extends AddTravelRecordDtoBase{
  
  @ApiProperty({
    description: 'The distance of the trip',
  })
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