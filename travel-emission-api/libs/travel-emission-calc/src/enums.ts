
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
        const vals = Object.values(TransportationMode);
        return vals.join(sep);
    }

    static convert2Enum(value: TransportationMode | string): TransportationMode {
        if (typeof value === 'string') {
            if (!Object.values(TransportationMode).includes(value as TransportationMode) ) {
                throw new Error(`Invalid transportation mode: ${value}`);
            }
            return value as TransportationMode;
        } else {
            return value;
        }
    }
  }
