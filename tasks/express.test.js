/**
 * Testing for backend express routes
 */
const axios = require('axios');
const endpoint = "http://localhost:4000";

// for dropping DB
const { MongoClient, Collection } = require('mongodb');
const settings = require("./config/settings");
const mongoConfig = settings.mongoConfig;

describe("insert", () => {
  let db;
  let conn;

  const config = {
    url: endpoint + "/locations/add",
    data: {
      name: "Gavin's Cave",
      location: [69, 69],
      description: "Dark and moist",
      tags: ['Dungeon']
    }
  };

  beforeAll(async() => {
    ({ db, conn }) = await connectToDb();
  });

  afterAll(async () => {
    cleanUp(db, conn);
  })
  
  it("should add a location", async () => {
    try {
      const { data } = await axios(config);
      expect(data.name).toEqual(config.data.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
});

const connectToDb = async () => {
  let connection = await MongoClient.connect(mongoConfig.serverUrl, 
    {useNewUrlParser: true,
    useUnifiedTopology: true});
  return {
    db: await connection.db(mongoConfig.database),
    conn: connection
  };
};

const cleanUp = async (db, conn) => {
  await db.dropDatabase();
  await conn.close();
};

// // add a post
// describe("insert", () => {
//   it("should add a post")
// })