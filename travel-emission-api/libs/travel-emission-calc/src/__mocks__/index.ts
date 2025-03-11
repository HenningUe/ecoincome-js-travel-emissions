

import { TransportationMode } from './../enums';
export * from './../enums';


export async function  getDistanceKm(
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<number> {
    return Promise.resolve(40)
}


export async function getEmissionCO2KgTotalPerPerson(
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<Map<string, number>> {
    const returnValues = new Map<string, number>([
        ['emissionCO2', 100],
        ['distanceKm', 600],
      ]);
    return Promise.resolve(returnValues)
}


export async function getEmissionCO2KgPerDistanceInKm(
    transportMode: TransportationMode | string,
    distanceKm: number,
): Promise<number> {
    return Promise.resolve(70)
}