const express = require('express');
const debug = require('debug');
const Labels = require('../models/labels');
const Assets = require('../models/assets');

const router = express.Router();
const print = debug('oodump');

router.get('/:id', (req, res) => {
  const labelId = req.params.id;
  let promise;

  print(`/label/${labelId} gets called`);

  if (labelId === 'root') {
    promise = Promise.all([
      Promise.resolve(null),
      Labels.find({parent_id: {$in: [null], $exists: true}}),
      Assets.find({labels: {$size: 0}})
    ]);
  } else {
    promise = Promise.all([
      Labels.findOne({id: labelId}).then(label => {
        if (label.parent_id === null) {
          label.parent = null;
          return label;
        }
        return Labels.findOne({id: label.parent_id})
        .then(parent => {
          label.parent = parent;
          return label;
        });
      }),
      Labels.find({parent_id: labelId}),
      Assets.find({labels: {$elemMatch: {id: labelId}}})
    ]);
  }
  promise.then(([current, children, assets]) => {
    res.render('label', {current, children, assets});
  });
});

module.exports = router;
