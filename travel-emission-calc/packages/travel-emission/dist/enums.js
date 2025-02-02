export var TransportationMode;
(function (TransportationMode) {
    TransportationMode[TransportationMode["Car"] = 0] = "Car";
    TransportationMode[TransportationMode["CarWithRideSharing"] = 1] = "CarWithRideSharing";
    TransportationMode[TransportationMode["PublicTransit"] = 2] = "PublicTransit";
    TransportationMode[TransportationMode["PlaneDomestic"] = 3] = "PlaneDomestic";
    TransportationMode[TransportationMode["PlaneInternational"] = 4] = "PlaneInternational";
    TransportationMode[TransportationMode["Bike"] = 5] = "Bike";
})(TransportationMode || (TransportationMode = {}));
export class TransportationModeUtils {
    static getPlaneModes() {
        const PLANE_TRANSPORT_MODES = [
            TransportationMode.PlaneDomestic,
            TransportationMode.PlaneInternational,
        ];
        return PLANE_TRANSPORT_MODES;
    }
    static getAsString(sep = ", ") {
        const vals = Object.values(TransportationMode);
        return vals.join(sep);
    }
    static convert2Enum(value) {
        if (typeof value === 'string') {
            value = TransportationMode[value];
        }
        return value;
    }
}
//# sourceMappingURL=enums.js.map