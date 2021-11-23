const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
      // ensure (lat,lng) as compound indexes for the locations
      if (collection==='Locations')
        await _col.createIndex(['lat', 'lng']);
    }
    return _col;
  };
};

module.exports = {
  posts: getCollectionFn('Posts'),
  locations: getCollectionFn('Locations')
};
