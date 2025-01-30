


import { TransportationMode, TransportationModeUtils } from './enums';
import { DistanceGetterWithConnection } from './dist_getter';

export async function  getDistanceKm(
    apiKey: string,
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<number> {

    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    const distGetter = new DistanceGetterWithConnection(apiKey);
    return distGetter.getDistanceAsKm(<TransportationMode>transportMode, origin, destination);
}


export async function getCO2EmissionKgTotalPerPerson(
    apiKey: string,
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<number> {
    // source https://ourworldindata.org/travel-carbon-footprint
    const CO2_EMISSION_KG_PER_KM: Record<TransportationMode, number> = {
        [TransportationMode.Car]: 0.170,
        [TransportationMode.CarWithRideSharing]: 0.068,  // = 0.170/2.5
        [TransportationMode.PlaneDomestic]: 0.246,
        [TransportationMode.PlaneInternational]: 0.150,
        [TransportationMode.PublicTransit]: 0.053,  // = (2*0.35 + 0.85)/10, 2/3*train+1/3bus
        [TransportationMode.Bike]: 0,
    };
    const distance: number = await getDistanceKm(apiKey, transportMode, origin, destination);
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    const emission: number = distance * CO2_EMISSION_KG_PER_KM[transportMode];
    return emission;
}