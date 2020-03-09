const path = require('path');

const bunyan = require('bunyan');
// Load package.json
const pkj = require('../package.json');

// Get some meta info from the package.json
const { name, version } = pkj;

// Set up a logger
// eslint-disable-next-line arrow-body-style
const getLogger = (serviceName, serviceVersion, level) => {
  return bunyan.createLogger({
    name: `${serviceName}:${serviceVersion}`,
    level
  });
};

// Configuration options for different environments
module.exports = {
  development: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'debug'),
    data: {
      feedback: path.join(__dirname, '../data/feedback.json')
    }
  },
  production: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'info'),
    data: {
      feedback: path.join(__dirname, '../data/feedback.json')
    }
  },
  test: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'fatal'),
    data: {
      speakers: path.join(__dirname, '../data/speakers.json')
    }
  }
};
