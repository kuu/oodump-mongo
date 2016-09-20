const config = require('config');
const OoyalaApi = require('ooyala-api');
const mongo = require('mongodb').MongoClient;
const debug = require('debug');

const MONGODB_HOST = (config.db && config.db.host) || 'localhost';
const MONGODB_PORT = (config.db && config.db.port) || 27017;
const dbConnectionUri = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/oodump`;
const print = debug('oodump');
const START_DATE = '2012-07-12';
const END_DATE = '2016-06-30';

const api = new OoyalaApi(config.api.key, config.api.secret, {concurrency: 6});

function _THROW(err) {
  throw(err);
}

function _ASSERT(...things) {
  things.forEach(thing => {
    if (!thing) {
      _THROW(new Error('_ASSERT error'));
    }
  });
}

function _RELAYERROR(err) {
  _THROW(err);
}

function buildLabelTree(collection, labels) {
  _ASSERT(collection, labels);

  if (labels.length === 0) {
    return Promise.resolve();
  }
  return Promise.all(labels.map(label => {
    return api.get(`/v2/labels/${label.id}/children`, {limit: 500}, {recursive: true})
    .then(children => {
      label.children_ids = children.map(child => child.id);
      collection.insert(label);
      return buildLabelTree(collection, children, label);
    });
  }));
}

function getViewership(collection, assets) {
  _ASSERT(collection, assets);

  return Promise.all(assets.map(asset => {
    return api.get(`/v2/analytics/reports/asset/${asset.embed_code}/performance/total/${START_DATE}...${END_DATE}`)
    .then(body => {
      const results = body.results;
      if (!results || results.length === 0) {
        collection.update({embed_code: asset.embed_code}, {$set: {total_plays: 0}});
      } else {
        const metrics = results[0].metrics;
        if (metrics.video && metrics.video.plays) {
          const plays = Number.parseInt(metrics.video.plays, 10);
          if (Number.isInteger(plays)) {
            collection.update({embed_code: asset.embed_code}, {$set: {total_plays: plays}});
          } else {
            collection.update({embed_code: asset.embed_code}, {$set: {total_plays: 0}});
          }
        } else {
          collection.update({embed_code: asset.embed_code}, {$set: {total_plays: 0}});
        }
      }
    });
  }));
}

module.exports = function (/* opts */) {
  // Connect to the db
  return mongo.connect(dbConnectionUri)
  .then(db => {
    print('Connected successfully to db');
    // Drop all collections from the db
    return db.collections().then(collections => {
      return Promise.all(collections.map(collection => {
        return collection.drop();
      }));
    }).then(() => {
      print('Dropped all collections from db');
      // Retrieve all assets from Ooyala
      return api.get('/v2/assets', {where: `asset_type='video'`, include: 'metadata,labels', limit: 500}, {recursive: true});
    }).then(assets => {
      const assetsCollection = db.collection('assets');
      print(`Retrieved ${assets.length} assets from Ooyala`);
      // Import the retrived assets into the db
      return assetsCollection.insertMany(assets)
      .then(() => {
        print('Imported the retrieved assets into db');
        // Retrieve viewership data and import them into the db
        return getViewership(assetsCollection, assets);
      });
    }).then(() => {
      print('Imported the retrieved viewership data into db');
      // Retrieve root-level labels from Ooyala
      return api.get('/v2/labels', {is_root: true, limit: 500}, {recursive: true});
    }).then(labels => {
      print(`Retrieved ${labels.length} root-level labels from Ooyala`);
      // Build a tree structure of labels
      const labelsCollection = db.collection('labels');
      return buildLabelTree(labelsCollection, labels);
    }).then(() => {
      print('Imported the retrieved labels into db');
      db.close();
    }).catch(err => {
      console.error(`Error occurred in importing data. ${err.stack}`);
      db.close();
      _RELAYERROR(err);
    });
  }).catch(err => {
    console.error(`Error occurred in connecting to db. ${err.stack}`);
    _RELAYERROR(err);
  });
};
