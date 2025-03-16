


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


export async function getEmissionCO2KgTotalPerPerson(
    transportMode: TransportationMode | string,
    origin: string,
    destination: string): Promise<Record<string, number>> {
    var distanceKm: number;
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    if (transportMode === TransportationMode.Bike) {
        distanceKm = 0;
    } else {
        distanceKm = await getDistanceKm(transportMode, origin, destination);
    }
    let emissionCO2Kg: number = await getEmissionCO2KgPerDistanceInKm(transportMode, distanceKm);
    const returnValues = {
        emissionCO2: emissionCO2Kg,
        distanceKm: distanceKm,
    }
    return returnValues;
}


export async function getEmissionCO2KgPerDistanceInKm(
    transportMode: TransportationMode | string,
    distanceKm: number,
): Promise<number> {
    
    const EMISSION_CO2_KG_PER_KM: Record<TransportationMode, number> = {
        [TransportationMode.Car]: 0.170,
        [TransportationMode.CarWithRideSharing]: 0.068,  // = 0.170/2.5 persons
        [TransportationMode.PlaneDomestic]: 0.246,
        [TransportationMode.PlaneInternational]: 0.150,
        [TransportationMode.PublicTransit]: 0.053,  // = (2*0.35 + 0.85)/10 = 2/3*train+1/3bus
        [TransportationMode.Bike]: 0,
    };
    var distanceKm: number;
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    let emissionCO2Kg: number = distanceKm * EMISSION_CO2_KG_PER_KM[transportMode];
    emissionCO2Kg = Number(emissionCO2Kg.toFixed(1));
    return emissionCO2Kg;
}