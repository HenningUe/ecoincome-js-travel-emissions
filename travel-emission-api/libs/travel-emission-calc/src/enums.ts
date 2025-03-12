
import { convert2Enum, getEnumAsString } from '@app/enum-helper';
export { EnumError } from '@app/enum-helper';


export enum TransportationMode {
    Car = 'Car',
    CarWithRideSharing = 'CarWithRideSharing',
    PublicTransit = 'PublicTransit',
    PlaneDomestic = 'PlaneDomestic',
    PlaneInternational = 'PlaneInternational',
    Bike = 'Bike',
}

export class TransportationModeUtils {
    static getPlaneModes(): TransportationMode[] {
        const PLANE_TRANSPORT_MODES: TransportationMode[] = [
            TransportationMode.PlaneDomestic,
            TransportationMode.PlaneInternational,
        ];
        return PLANE_TRANSPORT_MODES;
    }

    static getAsString(sep: string=", "): string {
        return getEnumAsString(TransportationMode)
    }

    static convert2Enum(value: TransportationMode | string): TransportationMode {
        return convert2Enum(TransportationMode, value);
    }
  }
