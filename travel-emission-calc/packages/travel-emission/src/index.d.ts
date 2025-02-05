export { TransportationMode, TransportationModeUtils } from './enums';
import { TransportationMode } from './enums';
export declare function getDistanceKm(transportMode: TransportationMode | string, origin: string, destination: string): Promise<number>;
export declare function getCO2EmissionKgTotalPerPerson(transportMode: TransportationMode | string, origin: string, destination: string): Promise<number>;
//# sourceMappingURL=index.d.ts.map