
export enum TransportationMode {
    Car,
    CarWithRideSharing,
    PublicTransit,
    PlaneDomestic,
    PlaneInternational,
    Bike
}

export class TransportationModeUtils {
    static getPlaneModes(): TransportationMode[] {
        const PLANE_TRANSPORT_MODES: TransportationMode[] = [
            TransportationMode.PlaneDomestic,
            TransportationMode.PlaneInternational,
        ];
        return PLANE_TRANSPORT_MODES;
    }

    static convert2Enum(value: TransportationMode | string): TransportationMode {
        if (typeof value === 'string') {
            value = TransportationMode[value as keyof typeof TransportationMode];
        }
        return value;
    }
  }
