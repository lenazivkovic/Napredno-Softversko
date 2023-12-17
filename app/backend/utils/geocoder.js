const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  // httpAdapter: 'https', //ovo sam dodao

  //NAPOMENA: ako se ne hardkodira vec uzme iz .env iz nekog razloga ne radi
  apiKey: 'ML6Jq9Y9tAlm0SBXkN1LyPUrrqInwX5i', // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
