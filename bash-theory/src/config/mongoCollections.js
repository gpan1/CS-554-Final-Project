const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      _col = await db.collection(collection);

      const locationIndexExists = await _col.indexExists('location_2d');
      // create a 2D index on [longtitude, latitude] pair 
      if (collection === 'Locations' && !locationIndexExists)
        await _col.createIndex({location: "2d"}, {unique:true});
    }
    return _col;
  };
};

module.exports = {
  posts: getCollectionFn('Posts'),
  locations: getCollectionFn('Locations')
};
