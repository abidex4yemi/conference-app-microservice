const path = require('path');

module.exports = {
  development: {
    sitename: 'Roux Meetups',
    data: {
      speakers: path.join(__dirname, '../data/speakers.json')
    },
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x'
  },
  production: {
    sitename: 'Roux Meetups',
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    data: {
      speakers: path.join(__dirname, '../data/speakers.json')
    }
  }
};
