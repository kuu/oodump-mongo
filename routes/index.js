const express = require('express');
const Assets = require('../models/assets');

const router = express.Router();

router.get('/', (req, res) => {
  Assets.hasData()
  .then(yes => {
    if (yes) {
      res.redirect('/label/root');
    } else {
      res.render('index');
    }
  });
});

module.exports = router;
