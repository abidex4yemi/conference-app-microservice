const express = require('express');

const router = express.Router();

module.exports = (param) => {
  const { feedback, speakers } = param;

  router.get('/', async (req, res) => {
    try {
      const { data } = await feedback.getList();

      const { data: speakerslist } = await speakers.getListShort();

      return res.render('feedback', {
        page: 'Feedback',
        feedbacklist: data,
        speakerslist,
        success: req.query.success
      });
    } catch (err) {
      return err;
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { data: speakerslist } = await speakers.getListShort();
      const name = req.body.fbName.trim();
      const title = req.body.fbTitle.trim();
      const message = req.body.fbMessage.trim();

      const feedbacklist = await feedback.getList();

      if (!name || !title || !message) {
        return res.render('feedback', {
          page: 'Feedback',
          error: true,
          name,
          title,
          message,
          feedbacklist,
          speakerslist
        });
      }
      await feedback.addEntry({ name, title, message });
      return res.redirect('/feedback?success=true');
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
