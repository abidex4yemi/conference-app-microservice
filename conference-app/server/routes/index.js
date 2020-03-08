const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = (param) => {
  const { speakers } = param;

  router.get('/images/:type/:file', async (req, res, next) => {
    try {
      const { type, file } = req.params;

      const image = await speakers.getImage(`${type}/${file}`);

      return image.data.pipe(res);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const { data: speakersList } = await speakers.getListShort();
      const { data: artwork } = await speakers.getAllArtwork();

      return res.render('index', {
        page: 'Home',
        speakerslist: speakersList,
        artwork
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(param));
  router.use('/feedback', feedbackRoute(param));

  return router;
};
