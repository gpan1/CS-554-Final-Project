const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);

      // create a 2D index on [longtitude, latitude] pair 
      if (collection === 'Locations' && !(await _col.indexExists('location_2d')))
        await _col.createIndex({location: "2d"}, {unique:true});
    }
    return _col;
  };
};

module.exports = {
  posts: getCollectionFn('Posts'),
  locations: getCollectionFn('Locations')
};
