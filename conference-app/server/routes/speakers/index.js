const express = require('express');

const router = express.Router();

module.exports = (param) => {
  const { speakers } = param;

  router.get('/', async (req, res) => {
    try {
      const { data: speakerList } = await speakers.getList();
      const { data: artwork } = speakers.getAllArtwork();

      return res.render('speakers', {
        page: 'All Speakers',
        speakerslist: speakerList,
        artwork
      });
    } catch (err) {
      return err;
    }
  });

  router.get('/:name', async (req, res, next) => {
    try {
      const { data: singleSpeaker } = await speakers.getSpeaker(
        req.params.name
      );
      const { data: artwork } = await speakers.getArtworkForSpeaker(
        req.params.name
      );

      const { data: speakerList } = await speakers.getList();

      if (!singleSpeaker) {
        return next();
      }

      return res.render('speakers/detail', {
        page: req.params.name,
        speaker: singleSpeaker,
        speakerslist: speakerList,
        artwork
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
