


import { TransportationMode } from './enums';
import { DistanceGetterWithConnection } from './dist_getter';

export async function  getAsyncDistanceAsKm(
    apiKey: string,
    transportationMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<number> {

    if (typeof transportationMode === 'string') {
        transportationMode = TransportationMode[transportationMode as keyof typeof TransportationMode];
    }

    const distGetter = new DistanceGetterWithConnection(apiKey);
    return distGetter.getDistanceAsKm(<TransportationMode>transportationMode, origin, destination);
}


export function getDistanceAsKm(
    apiKey: string,
    transportationMode: TransportationMode | string,
    origin: string,
    destination: string): number {
    var distance: number=-1;
    getAsyncDistanceAsKm(apiKey, transportationMode, origin, destination).then(x => {distance=x;});
    return distance;
}