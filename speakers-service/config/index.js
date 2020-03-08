const bunyan = require('bunyan');
const path = require('path');
const pkj = require('../package.json');

// Get some meta info from package.json
const { name, version } = pkj;

// Set up logger
const getLogger = (serviceName, serviceVersion, level) => {
  return bunyan.createLogger({
    name: `${serviceName}:${serviceVersion}`,
    level
  });
};

module.exports = {
  development: {
    name,
    version,
    serviceTimeOut: 30,
    log: () => getLogger(name, version, 'debug'),
    data: {
      speakers: path.join(__dirname, '../data/speakers.json'),
      images: path.join(__dirname, '../data/images')
    }
  },
  production: {
    name,
    version,
    serviceTimeOut: 30,
    log: () => getLogger(name, version, 'info'),
    data: {
      speakers: path.join(__dirname, '../data/speakers.json'),
      images: path.join(__dirname, '../data/images')
    }
  },
  test: {
    name,
    version,
    serviceTimeOut: 30,
    log: () => getLogger(name, version, 'fatal'),
    data: {
      speakers: path.join(__dirname, '../data/speakers.json'),
      images: path.join(__dirname, '../data/images')
    }
  }
};
