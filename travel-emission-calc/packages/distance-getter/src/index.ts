


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
    let resolveFunction = (value: number) => {distance=value;};
    let promise: Promise<number> = getAsyncDistanceAsKm(apiKey, transportationMode, origin, destination);
    promise
    .then(resolveFunction)
    .catch((error) => {
        console.error("Error occurred:", error);
      })
    .finally(() => {});
    while (distance === -1) {
        promise.then(resolveFunction);
    }
    return distance;
}