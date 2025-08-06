import axios from 'axios';

const getLocation = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new Error('Unable to fetch coordinates for the given address');
    }
    const location = response.data.results[0].geometry.location;
    return {
        lat: location.lat,
        lng: location.lng
    };
};

export { getLocation };