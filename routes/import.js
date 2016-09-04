const express = require('express');
const importData = require('../lib/import');

const router = express.Router();

router.get('/', (req, res) => {
  importData().then(() => {
    res.status(200).send();
  }).catch(err => {
    res.status(500).send(err.message);
  });
});

module.exports = router;
