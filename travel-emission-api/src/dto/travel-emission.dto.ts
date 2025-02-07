

import { IsEnum, IsString, IsDate } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '@app/travel-emission-calc';
export { TransportationMode };


export class getCO2EmissionDto {

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