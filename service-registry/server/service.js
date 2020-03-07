const express = require('express');

const service = express();

module.exports = (config) => {
  const log = config.log();

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);

      return next();
    });
  }

  service.put(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res, next) => {
      return next('Not implemented');
    }
  );

  service.delete(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res, next) => {
      return next('Not implemented');
    }
  );

  service.get('/find/:serviceName/:serviceVersion', (req, res, next) => {
    return next('Not implemented');
  });

  service.use((err, req, res, next) => {
    res.status(err.status || 500);

    log.error(err);

    return res.json({
      error: {
        message: err.message
      }
    });
  });

  return service;
};
