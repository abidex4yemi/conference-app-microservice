const bunyan = require('bunyan');
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
