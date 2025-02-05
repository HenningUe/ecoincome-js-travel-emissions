


export { TransportationMode, TransportationModeUtils } from './enums';
import { TransportationMode, TransportationModeUtils } from './enums';
import { DistanceGetterGoogle } from './dist_getter';

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
    destination: string): Promise<number> {
    // source https://ourworldindata.org/travel-carbon-footprint
    const CO2_EMISSION_KG_PER_KM: Record<TransportationMode, number> = {
        [TransportationMode.Car]: 0.170,
        [TransportationMode.CarWithRideSharing]: 0.068,  // = 0.170/2.5 persons
        [TransportationMode.PlaneDomestic]: 0.246,
        [TransportationMode.PlaneInternational]: 0.150,
        [TransportationMode.PublicTransit]: 0.053,  // = (2*0.35 + 0.85)/10 = 2/3*train+1/3bus
        [TransportationMode.Bike]: 0,
    };
    var distance: number;
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    if (transportMode === TransportationMode.Bike) {
        distance = 0;
    } else {
        distance = await getDistanceKm(transportMode, origin, destination);
    }
    let emission: number = distance * CO2_EMISSION_KG_PER_KM[transportMode];
    emission = Number(emission.toFixed(1));
    return emission;
}