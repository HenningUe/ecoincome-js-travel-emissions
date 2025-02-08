

import { IsEnum, IsString, IsDate, IsOptional } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '@app/travel-emission-calc';
import { Company } from '../entities/travel-emission.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export { TransportationMode };


export class getCO2EmissionSinglePersonDto {

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

  
export class getCO2EmissionPerDateRangeDto {
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

  
  export class addTravelRecordDto {

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
      description: 'The origin of the trip',
    })
    @IsString()
    origin: string;

    @ApiProperty({
      description: 'The destination of the trip',
    })
    @IsString()
    destination: string;

    @ApiProperty({
      type: Date,
      description: 'Date of travel. Format: YYYY-MM-DD',
    })
    @Type(() => Date)
    @IsDate()
    travelDate: Date;
    
    constructor(
      transportationMode: TransportationMode,
      origin: string,
      destination: string,
      company: string,
      travelDate: Date,
    ) {
      this.transportationMode = transportationMode;
      this.origin = origin;
      this.destination = destination;
      this.company = company;
      this.travelDate = travelDate;
    }
  }