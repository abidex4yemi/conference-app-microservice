const express = require('express');
const service = express();
const Speakers = require('./lib/Speakers');

module.exports = (config) => {
  const log = config.log();

  const speakers = new Speakers(config.data.speakers);

  service.use('/images', express.static(config.data.images));

  // Add a request logging middle in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}:${req.url}`);

      return next();
    });
  }

  service.get('/list', async (req, res, next) => {
    try {
      const allSpeakers = await speakers.getList();

      return res.json(allSpeakers);
    } catch (error) {
      return next(error);
    }
  });

  service.get('/list-short', async (req, res) => {
    try {
      const speakersListShort = await speakers.getListShort();

      return res.json(speakersListShort);
    } catch (error) {
      return next(error);
    }
  });

  service.get('/names', async (req, res) => {
    try {
      const speakersName = await speakers.getNames();

      return res.json(speakersName);
    } catch (error) {
      return next(error);
    }
  });

  service.get('/speaker/:shortName', async (req, res) => {
    try {
      const speakerShortName = await speakers.getSpeaker(req.params.shortName);

      return res.json(speakerShortName);
    } catch (error) {
      return next(error);
    }
  });

  service.get('/artwork', async (req, res) => {
    try {
      const artworks = await speakers.getAllArtwork();

      return res.json(artworks);
    } catch (error) {
      return next(error);
    }
  });

  service.get('/artwork/:shortName', async (req, res) => {
    try {
      const speakerArtwork = await speakers.getArtworkForSpeaker(
        req.params.shortName
      );

      return res.json(speakerArtwork);
    } catch (error) {
      return next(error);
    }
  });

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

  return service;
};
