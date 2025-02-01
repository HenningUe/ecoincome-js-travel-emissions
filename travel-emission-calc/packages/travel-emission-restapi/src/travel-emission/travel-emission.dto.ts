

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransportationMode, TransportationModeUtils } from '../../../travel-emission/src/enums';


export class getCO2EmissionDto {
    @IsEnum(TransportationMode, { message: `Must be one of: ${TransportationModeUtils.getAsString()}` })
    TransportationMode: TransportationMode;
    @IsString()
    origin: string;
    @IsString()
    destination: string;
  }