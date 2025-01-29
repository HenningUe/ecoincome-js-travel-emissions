


import { TransportationMode } from './enums';
import { DistanceGetterWithConnection } from './dist_getter';

export function getAsyncDistanceAsKm(
    apiKey: string,
    transportationMode: TransportationMode,
    origin: string,
    destination: string): Promise<number> {

    const distGetter = new DistanceGetterWithConnection(apiKey);
    return distGetter.getDistanceAsKm(transportationMode, origin, destination);
}


export function getDistanceAsKm(
    apiKey: string,
    transportationMode: TransportationMode,
    origin: string,
    destination: string): number {
    var distance: number=-1;
    getAsyncDistanceAsKm(apiKey, transportationMode, origin, destination)
    .then(distx => {distance=distx;}).catch(error => console.error(error));
    return distance;
}