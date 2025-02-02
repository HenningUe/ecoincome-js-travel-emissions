export { TransportationMode } from './enums';
import { TransportationMode, TransportationModeUtils } from './enums';
import { DistanceGetterGoogle } from './dist_getter';
export async function getDistanceKm(transportMode, origin, destination) {
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    const distGetter = new DistanceGetterGoogle();
    return distGetter.getDistanceAsKm(transportMode, origin, destination);
}
export async function getCO2EmissionKgTotalPerPerson(transportMode, origin, destination) {
    const CO2_EMISSION_KG_PER_KM = {
        [TransportationMode.Car]: 0.170,
        [TransportationMode.CarWithRideSharing]: 0.068,
        [TransportationMode.PlaneDomestic]: 0.246,
        [TransportationMode.PlaneInternational]: 0.150,
        [TransportationMode.PublicTransit]: 0.053,
        [TransportationMode.Bike]: 0,
    };
    var distance;
    transportMode = TransportationModeUtils.convert2Enum(transportMode);
    if (transportMode === TransportationMode.Bike) {
        distance = 0;
    }
    else {
        distance = await getDistanceKm(transportMode, origin, destination);
    }
    const emission = distance * CO2_EMISSION_KG_PER_KM[transportMode];
    return emission;
}
//# sourceMappingURL=index.js.map