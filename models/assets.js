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
      const assetsCollection = db.collection('assets');
      return assetsCollection.find(...params).toArray().then(assets => {
        print(`Retrieved ${assets.length} assets`);
        db.close();
        return assets;
      });
    });
  },
  hasData: () => {
    return mongo.connect(dbConnectionUri)
    .then(db => {
      const assetsCollection = db.collection('assets');
      return assetsCollection.count().then(count => {
        db.close();
        print(`hasData => ${count > 0}`);
        return count > 0;
      });
    });
  }
};
