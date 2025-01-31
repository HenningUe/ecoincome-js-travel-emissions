import { TransportationMode } from './enums';
declare abstract class DistanceGetterBase {
    abstract getDistanceAsKm(transportationMode: TransportationMode, origin: string, destination: string): Promise<number>;
}
export declare class DistanceGetterGoogle extends DistanceGetterBase {
    private apiKey;
    constructor(apiKey: string);
    getDistanceAsKm(transportationMode: TransportationMode, origin: string, destination: string): Promise<number>;
    getDistForNonePlane(transportationMode: TransportationMode, origin: string, destination: string): Promise<number>;
    getDistForPlane(transportationMode: TransportationMode, origin: string, destination: string): Promise<number>;
}
export {};
