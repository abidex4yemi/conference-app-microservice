const bunyan = require('bunyan');

// Load package.json file
const pjs = require('../package.json');

// get some meta info from the package.json
const { name, version } = pjs;

// setup logger
const getLogger = (serviceName, serviceVersion, level) => {
  bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });
};

// configuration options for different environment
module.exports = {
  development: {
    name,
    version,
    serviceTimeOut: 30,
    log: () => getLogger(name, version, 'debug')
  },
  production: {
    name,
    version,
    serviceTimeOut: 30,
    log: () => getLogger(name, version, 'info')
  },
  test: {
    name,
    version,
    serviceTimeOut: 30,
    log: () => getLogger(name, version, 'fatal')
  }
};
