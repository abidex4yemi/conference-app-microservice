const express = require('express');
const service = express();

module.exports = (config) => {
  const log = config.log();

  // Add a request logging middle in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}:${req.url}`);

      return next();
    });
  }

  service.use((err, req, res, next) => {
    res.status(err.status || 500);

    // Log out the error to the console
    log.error(error);

    return res.json({
      error: {
        message: err.message
      }
    });
  });
};
