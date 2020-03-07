const express = require('express');
const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();

module.exports = (config) => {
  const log = config.log();

  const serviceRegistry = new ServiceRegistry(log);

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);

      return next();
    });
  }

  service.put(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      // Note: we are making sure we conform to IPV6 standard in the case
      // of request ip is IPV6 that's why we have this [${req.connection.remoteAddress}]
      const serviceIp = req.connection.remoteAddress.includes('::')
        ? `[${req.connection.remoteAddress}]`
        : req.connection.remoteAddress;

      const serviceKey = serviceRegistry.register({
        serviceName,
        serviceVersion,
        servicePort,
        serviceIp
      });

      return res.status(200).json({ result: serviceKey });
    }
  );

  service.delete(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res, next) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      // Note: we are making sure we conform to IPV6 standard in the case
      // of request ip is IPV6 that's why we have this [${req.connection.remoteAddress}]
      const serviceIp = req.connection.remoteAddress.includes('::')
        ? `[${req.connection.remoteAddress}]`
        : req.connection.remoteAddress;

      const serviceKey = serviceRegistry.unregister({
        serviceName,
        serviceVersion,
        servicePort,
        serviceIp
      });

      return res.status(200).json({ result: serviceKey });
    }
  );

  service.get('/find/:serviceName/:serviceVersion', (req, res) => {
    const { serviceName, serviceVersion } = req.params;
    const service = serviceRegistry.get(serviceName, serviceVersion);

    if (!service) {
      return res.status(404).json({
        result: 'Service not found'
      });
    }

    return res.status(200).json(service);
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
