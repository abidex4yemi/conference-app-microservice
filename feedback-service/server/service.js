const express = require('express');
const amqplib = require('amqplib');
const Feedback = require('./lib/Feedback');

const service = express();

module.exports = (config) => {
  const feedback = new Feedback(config.data.feedback);

  const log = config.log();

  (async () => {
    try {
      const q = 'feedback';

      const connection = await amqplib.connect('amqp://localhost');

      const channel = await connection.createChannel();

      await channel.assertQueue(q);

      channel.consume(q, async (msg) => {
        if (msg !== null) {
          log.debug(`Got message ${msg.content.toString()}`);

          const { name, title, message } = JSON.parse(msg.content.toString());

          await feedback.addEntry({ name, title, message });

          channel.ack(msg);
        }
      });
    } catch (error) {
      log.fatal(error);
    }
  })();

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.get('/list', async (req, res, next) => {
    try {
      return res.json(await feedback.getList());
    } catch (err) {
      return next(err);
    }
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message
      }
    });
  });

  return service;
};
