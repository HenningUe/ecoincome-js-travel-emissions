


const axios = require('axios');

// Replace with your Google Maps API key
const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Function to calculate driving distance
async function getDrivingDistance(origin, destination) {
    const endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const params = {
        origins: origin,
        destinations: destination,
        mode: 'driving',
        key: API_KEY,
    };

    try {
        const response = await axios.get(endpoint, { params });
        const data = response.data;

        if (data.status === 'OK') {
            const element = data.rows[0].elements[0];
            if (element.status === 'OK') {
                const distance = element.distance.text; // e.g., "423 km"
                const duration = element.duration.text; // e.g., "4 hours 35 mins"
                console.log(`Distance: ${distance}`);
                console.log(`Duration: ${duration}`);
            } else {
                console.error(`Error: ${element.status}`);
            }
        } else {
            console.error(`API Error: ${data.status}`);
        }
    } catch (error) {
        console.error(`Request failed: ${error.message}`);
    }
}

// Replace these cities with your desired locations
const originCity = 'Los Angeles, CA';
const destinationCity = 'San Francisco, CA';

getDrivingDistance(originCity, destinationCity);