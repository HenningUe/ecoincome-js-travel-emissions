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
    static getAsString(sep?: string): string;
    static convert2Enum(value: TransportationMode | string): TransportationMode;
}
//# sourceMappingURL=enums.d.ts.map