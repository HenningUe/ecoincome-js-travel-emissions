

import { IsEnum, IsString } from 'class-validator';
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
      TransportationMode: TransportationMode,
      origin: string,
      destination: string,
    ) {
      this.transportationMode = TransportationMode;
      this.origin = origin;
      this.destination = destination;
    }
  }