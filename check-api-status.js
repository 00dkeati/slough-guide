const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_PLACES_API_KEY;

if (!apiKey) {
  console.log('NO - API key not found in .env.local');
  process.exit(1);
}

console.log('Testing Google API...');

fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=50.8793,-1.0345&radius=3000&type=restaurant&key=' + apiKey)
  .then(res => res.json())
  .then(data => {
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      console.log('YES - Google API is WORKING');
      console.log('Found ' + data.results.length + ' real businesses');
    } else {
      console.log('NO - Google API is NOT working');
      console.log('Status: ' + data.status);
      if (data.error_message) {
        console.log('Error: ' + data.error_message);
      }
    }
  })
  .catch(err => {
    console.log('NO - Network error: ' + err.message);
  });
