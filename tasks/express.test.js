/**
 * Testing for backend express routes
 */
const axios = require('axios');
const endpoint = "http://localhost:4000";
const app = require('../app');
const request = require('supertest');

// for dropping DB
const { MongoClient } = require('mongodb');
const settings = require("../config/settings");
const mongoConfig = settings.mongoConfig;

describe("Location insert", () => {
  let db;
  let conn;

  let body = {
    name: "Gavin's Cave",
    location: [69, 69],
    description: "Dark and moist",
    tags: ['Dungeon']
  };

  beforeAll(async() => {
    ({ db, conn } = await connectToDb());
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  })
  
  it("should add a location", async () => {
    try {
      const response = await request(app)
        .post('/locations/add')
        .send(body);
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
});

/**
 * Wrote this so I don't have to rewrite it in each test case.
 * @returns {object} {db, conn}
 */
const connectToDb = async () => {
  let connection = await MongoClient.connect(mongoConfig.serverUrl, 
    {useNewUrlParser: true,
    useUnifiedTopology: true});
  return {
    db: await connection.db(mongoConfig.database),
    conn: connection
  };
};

/**
 * Drops database and closes the connection
 * @param {object} db 
 * @param {object} conn 
 */
const cleanUp = async (db, conn) => {
  await db.dropDatabase();
  await conn.close();
};

// // add a post
// describe("insert", () => {
//   it("should add a post")
// })