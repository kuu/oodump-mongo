const config = require('config');
const debug = require('debug');
const mongo = require('mongodb').MongoClient;

const MONGODB_HOST = (config.db && config.db.host) || 'localhost';
const MONGODB_PORT = (config.db && config.db.port) || 27017;
const dbConnectionUri = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/oodump`;
const print = debug('oodump');

module.exports = {
  find: (...params) => {
    return mongo.connect(dbConnectionUri)
    .then(db => {
      const labelsCollection = db.collection('labels');
      return labelsCollection.find(...params).toArray().then(labels => {
        print(`Retrieved ${labels.length} labels`);
        db.close();
        return labels;
      });
    });
  },
  findOne: (...params) => {
    return mongo.connect(dbConnectionUri)
    .then(db => {
      const labelsCollection = db.collection('labels');
      return labelsCollection.findOne(...params).then(label => {
        print(`Retrieved a label`);
        db.close();
        return label;
      });
    });
  }
};
