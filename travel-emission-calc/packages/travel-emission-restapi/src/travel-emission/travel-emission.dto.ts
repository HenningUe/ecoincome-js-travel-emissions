

import { IsEnum, IsString } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '../../../travel-emission/src/index';
export { TransportationMode };


export class getCO2EmissionDto {
    @IsEnum(TransportationMode, { message: `Must be one of: ${TransportationModeUtils.getAsString()}` })
    TransportationMode: TransportationMode;
    @IsString()
    origin: string;
    @IsString()
    destination: string;
    
    constructor(TransportationMode: TransportationMode, origin: string, destination: string) {
      this.TransportationMode = TransportationMode;
      this.origin = origin;
      this.destination = destination;
    }
  }