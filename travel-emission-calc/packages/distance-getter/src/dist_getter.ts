
import {With, contextmanager} from 'contextlib';


abstract class DistanceGetter {
    abstract getDistanceAsKm(origin: string, destination: string): Promise<number>
  
    abstract openConnection(): DistanceGetter;
    abstract closeConnection(): void;

    enter() { 
      this.openConnection();
    }

    exit() { 
      this.closeConnection();
    }
}

class DistanceGetterWithConnection extends DistanceGetter {
  private apiKey: string;
  
  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }
  
  openConnection(): DistanceGetter {
    console.log('open connection');
    return this;
  }
  
  closeConnection(): void {
    console.log('close connection');
  }

  async getDistanceAsKm(origin: string, destination: string): Promise<number> {
      const endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json';
      const params = {
          origins: origin,
          destinations: destination,
          mode: 'driving',
          key: this.apiKey,
      };

      try {
          const response = await axios.get(endpoint, { params });
          const data = response.data;

          if (data.status === 'OK') {
              const element = data.rows[0].elements[0];
              if (element.status === 'OK') {
                  var distance: string = element.distance.text; // e.g., "423 km"
                  console.log(`Distance: ${distance}`);
              } else {
                  console.error(`Error: ${element.status}`);
              }
          } else {
              console.error(`API Error: ${data.status}`);
          }
      } catch (error) {
          console.error(`Request failed: ${error.message}`);
      }
      return distance;
  }
}

function exampleCall() {
  With(new DistanceGetterWithConnection("b"), () => {
    console.log('inside context')
  })
}
