export declare enum TransportationMode {
    Car = 0,
    CarWithRideSharing = 1,
    PublicTransit = 2,
    PlaneDomestic = 3,
    PlaneInternational = 4,
    Bike = 5
}
export declare class TransportationModeUtils {
    static getPlaneModes(): TransportationMode[];
    static convert2Enum(value: TransportationMode | string): TransportationMode;
}
