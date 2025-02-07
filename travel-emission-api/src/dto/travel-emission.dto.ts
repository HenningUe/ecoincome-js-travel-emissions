

import { IsEnum, IsString, IsDate } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '@app/travel-emission-calc';
import { Company } from '../entities/travel-emission.entity';
export { TransportationMode };


export class getCO2EmissionSinglePersonDto {

    @IsEnum(TransportationMode,
      { message: `transportationMode must be one of: ${TransportationModeUtils.getAsString()}` })
    transportationMode: TransportationMode;
    @IsString()
    origin: string;
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
  @IsString()
  company: string;
  @IsEnum(TransportationMode,
    { message: `transportationMode must be one of: ${TransportationModeUtils.getAsString()}` })
  transportationMode: TransportationMode | undefined = undefined;
  @IsDate()
  dateBegin: Date | undefined = undefined;
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
  
    @IsEnum(TransportationMode,
      { message: `transportationMode must be one of: ${TransportationModeUtils.getAsString()}` })
    transportationMode: TransportationMode;
    @IsString()
    origin: string;
    @IsString()
    destination: string;
    @IsString()
    company: string;
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