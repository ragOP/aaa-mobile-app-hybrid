import axios from 'axios';

const OPENCAGE_API_KEY = 'fb60d08501c04460a47b9d4f5fa4c860'; // Replace with your OpenCage API Key
exports.getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
    );

    if (response.data.results.length > 0) {
      const address = response.data.results[0].formatted;
      return address;
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching address from OpenCage:', error.message);
    throw new Error('Error fetching address');
  }
};