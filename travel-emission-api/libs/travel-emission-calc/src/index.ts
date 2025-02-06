


import { TransportationMode, TransportationModeUtils } from './enums';
import { DistanceGetterGoogle } from './dist-getter';
export { TransportationMode, TransportationModeUtils } from './enums';

export async function  getDistanceKm(
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<number> {

    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    const distGetter = new DistanceGetterGoogle();
    return distGetter.getDistanceAsKm(<TransportationMode>transportMode, origin, destination);
}


export async function getCO2EmissionKgTotalPerPerson(
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<Map<string, number>> {
    // source https://ourworldindata.org/travel-carbon-footprint
    const CO2_EMISSION_KG_PER_KM: Record<TransportationMode, number> = {
        [TransportationMode.Car]: 0.170,
        [TransportationMode.CarWithRideSharing]: 0.068,  // = 0.170/2.5 persons
        [TransportationMode.PlaneDomestic]: 0.246,
        [TransportationMode.PlaneInternational]: 0.150,
        [TransportationMode.PublicTransit]: 0.053,  // = (2*0.35 + 0.85)/10 = 2/3*train+1/3bus
        [TransportationMode.Bike]: 0,
    };
    var distanceKm: number;
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    if (transportMode === TransportationMode.Bike) {
        distanceKm = 0;
    } else {
        distanceKm = await getDistanceKm(transportMode, origin, destination);
    }
    let emissionCO2: number = distanceKm * CO2_EMISSION_KG_PER_KM[transportMode];
    emissionCO2 = Number(emissionCO2.toFixed(1));
    const returnValues = new Map<string, number>([
        ['emissionCO2', emissionCO2],
        ['distanceKm', distanceKm],
      ]);
    return returnValues;
}