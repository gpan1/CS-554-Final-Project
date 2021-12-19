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

describe("Location CRUD", () => {
  let db;
  let conn;

  beforeAll(async() => {
    ({ db, conn } = await connectToDb());  
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  })
  
  let postId;

  it("should add a location", async () => {
    let body = {
      name: "Gavin's Cave",
      location: [69, 69],
      description: "Dark and moist",
      tags: ['Dungeon']
    };
    try {
      const response = await request(app)
        .post('/locations/add')
        .send(body);
      postId = response.body._id;
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });

  it("should add a second location", async () => {
    let body = {
      name: "elo hell",
      location: [-69, -69],
      description: "totally real",
      tags: ['for sure a real place']
    };
    try {
      const response = await request(app)
        .post('/locations/add')
        .send(body);
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should retrieve both the added locations", async () => {
    try {
      const response = await request(app)
        .get('/locations/all');
      expect(response.body.length).toEqual(2);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should retrieve added location by id", async () => {
    try {
      const response = await request(app)
        .get('/locations/byId/' + postId);
      expect(response.body._id).toEqual(postId);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should update the added location", async () => {
    let updateBody = {
      name: "Gavin's New Cave"
    };
    try {
      const response = await request(app)
        .patch('/locations/update/' + postId)
        .send(updateBody);
      expect(response.body.name).toEqual(updateBody.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should remove the added location", async () => {
    try {
      const response = await request(app)
        .post('/locations/remove/' + postId);
      expect(response.statusCode).toEqual(200);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should be unable to get the deleted location", async () => {
    try {
      const response = await request(app)
        .get('/locations/byId/' + postId);
    } catch (e) {
      expect(e.response.statusCode).toEqual(404);
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