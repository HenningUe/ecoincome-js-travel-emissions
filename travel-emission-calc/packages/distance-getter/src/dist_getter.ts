
import axios from 'axios';
import { TransportationMode } from './enums';

abstract class DistanceGetter {
    abstract getDistanceAsKm(
      transportationMode: TransportationMode,
      origin: string,
      destination: string): Promise<number>
}


export class DistanceGetterWithConnection extends DistanceGetter {
  private apiKey: string;
  
  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }


  async getDistanceAsKm(
    transportationMode: TransportationMode,
    origin: string,
    destination: string,
  ): Promise<number> {
    if (transportationMode === TransportationMode.Plane) {
      return this.getDistForPlane(transportationMode, origin, destination);
    } else {
      return this.getDistForNonePlane(transportationMode, origin, destination);
    }
  }


  async getDistForNonePlane(
    transportationMode: TransportationMode,
    origin: string,
    destination: string,
  ): Promise<number> {
    const endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json';

    const transpModeMap: Map<TransportationMode, string> = new Map([
      [TransportationMode.Car, 'driving'],
      [TransportationMode.CarWithRideSharing, 'driving'],
      [TransportationMode.Train, 'transit'],
      [TransportationMode.Bike, 'bicycling'],
    ]);
  
    const params = {
        origins: origin,
        destinations: destination,
        mode: transpModeMap.get(transportationMode),
        units:'metric',
        key: this.apiKey,
    };
    try {
        var response = await axios.get(endpoint, { params });
    } catch (error) {
        console.error(`Request failed: ${error.message}`);
    }
    const data = await response.data;
    if (data.status !== 'OK') {
      throw new Error(`API error. data.status: ${data.status}`);
    }
    const element = data.rows[0].elements[0];
    if (element.status !== 'OK') {
      console.error(`Error: ${element.status}`);
      throw new Error(`API error. element.status: ${element.status}`);
    }
    let distanceStr: string = await element.distance.text; // e.g., "423 km"
    console.debug(`Distance: ${distanceStr}`);
    distanceStr = distanceStr.replace(/[0-9\.]*$/, '');
    const distance: number = parseFloat(distanceStr);
    return distance;
  }

  async getDistForPlane(
    transportationMode: TransportationMode,
    origin: string,
    destination: string,
  ): Promise<number> {
    throw new Error('Not implemented');
  }
}

