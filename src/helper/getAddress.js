import axios from 'axios';

const OPENCAGE_API_KEY = '5dea540accc54d1b80abc3b528679557'; // Replace with your OpenCage API Key
exports.getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${OPENCAGE_API_KEY}`
    );

    console.log('Response: >>>>>', latitude, longitude, response.data);

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
