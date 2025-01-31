import { TransportationMode } from './enums';
export declare function getDistanceKm(apiKey: string, transportMode: TransportationMode | string, origin: string, destination: string): Promise<number>;
export declare function getCO2EmissionKgTotalPerPerson(apiKey: string, transportMode: TransportationMode | string, origin: string, destination: string): Promise<number>;
