// taken from lecture code
const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings')

const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  connectToDb: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(process.env.MONGODB_URI || mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      _db = await _connection.db(mongoConfig.database);
    }
    return _db;
  },
  closeConnection: () => {
    _connection.close();
  }
};