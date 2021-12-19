const userRoutes = require('./locations');
const postRoutes = require('./posts');

const constructorMethod = (app) => {
  app.use('/locations', userRoutes);
  app.use('/posts', postRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;