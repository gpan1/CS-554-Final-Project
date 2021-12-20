/**
 * Testing for backend express routes
 */
const axios = require("axios");
const endpoint = "http://localhost:4000";
const app = require("../app");
const request = require("supertest");

// for dropping DB
const { MongoClient } = require("mongodb");
const settings = require("../config/settings");
const mongoConfig = settings.mongoConfig;

const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

describe("Location CRUD", () => {
  let db;
  let conn;

  beforeAll(async () => {
    ({ db, conn } = await connectToDb());
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  });

  let postId;

  it("should add a location", async () => {
    let body = {
      name: "Gavin's Cave",
      location: [69, 69],
      description: "Dark and moist",
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/locations/add").send(body);
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
      tags: ["for sure a real place"],
    };
    try {
      const response = await request(app).post("/locations/add").send(body);
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should retrieve both the added locations", async () => {
    try {
      const response = await request(app).get("/locations/all");
      expect(response.body.length).toEqual(2);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should retrieve added location by id", async () => {
    try {
      const response = await request(app).get("/locations/byId/" + postId);
      expect(response.body._id).toEqual(postId);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should retrieve added location by tags", async () => {
    try {
      const response = await request(app)
        .get("/locations/byTags/")
        .send(["Dungeon"]);
      expect(response.body[0]._id).toEqual(postId);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should update the added location", async () => {
    let updateBody = {
      name: "Gavin's New Cave",
    };
    try {
      const response = await request(app)
        .patch("/locations/update/" + postId)
        .send(updateBody);
      expect(response.body.name).toEqual(updateBody.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should remove the added location", async () => {
    try {
      const response = await request(app).post("/locations/remove/" + postId);
      expect(response.statusCode).toEqual(200);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should be unable to get the deleted location", async () => {
    try {
      const response = await request(app).get("/locations/byId/" + postId);
    } catch (e) {
      expect(e.response.statusCode).toEqual(404);
    }
  });
});

describe("Location search", () => {
  let db, conn;

  beforeAll(async () => {
    ({ db, conn } = await connectToDb());
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  });

  it("should successfully create two locations", async () => {
    let loc1 = {
      name: "loc1",
      description: "first one",
      tags: ["Building", "Professor"],
      location: [0, 0],
    };
    try {
      const response = await request(app).post("/locations/add").send(loc1);
      expect(response.body.name).toEqual(loc1.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }

    let loc2 = {
      name: "loc2",
      description: "second one",
      tags: ["Eating Spot", "Class"],
      location: [1, 1],
    };
    try {
      const response = await request(app).post("/locations/add").send(loc2);
      expect(response.body.name).toEqual(loc2.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should successfully find loc1 from a term search", async () => {
    const body = {
      term: "loc1",
    };

    try {
      const response = await request(app).post("/locations/search").send(body);
      expect(response.body[0].name).toEqual(body.term);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should successfully find loc2 from a tag search", async () => {
    const body = {
      term: "loc",
      tags: ["Eating Spot", "Class"],
    };

    try {
      const response = await request(app).post("/locations/search").send(body);
      expect(response.body[0].name).toEqual("loc2");
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
});

describe("Location popularity", () => {
  let db, conn, client;
  
  beforeAll( async () => {
    ({db, conn, client} = await connectToDb());
    await client.flushallAsync();
  });

  afterAll( async () => {
    await cleanUp(db, conn, client);
  });

  let locId;

  it("should add three locations", async () => {
    let loc1 = {
      name: "loc1",
      description: "first one",
      tags: ["Building", "Professor"],
      location: [0, 0],
    };
    let loc2 = {
      name: "loc2",
      description: "second one",
      tags: ["Building", "Professor"],
      location: [1, 0],
    };
    let loc3 = {
      name: "loc3",
      description: "third one",
      tags: ["Building", "Professor"],
      location: [2, 0],
    };

    try {
      const result1 = await request(app)
        .post('/locations/add')
        .send(loc1);
      locId = result1.body._id;
      expect(result1.body.name).toBeTruthy();

      const result2 = await request(app)
        .post('/locations/add')
        .send(loc2);
      expect(result2.body.name).toBeTruthy();

      const result3 = await request(app)
        .post('/locations/add')
        .send(loc3);
      expect(result3.body.name).toBeTruthy();

    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should get one of the locations by id, thus increasing popularity", async () => {
    expect(locId).toBeTruthy();

    try {
      const response = await request(app)
        .get('/locations/byId/' + locId);
      expect(response.body.name).toBeTruthy();
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should get popular posts, with the accessed one first in the list", async () => {
    expect(locId).toBeTruthy();
    try {
      const response = await request(app)
        .get('/locations/popular');
      console.log(response.body);
      expect(response.body.length).toEqual(3);
      expect(response.body[0]).toEqual(locId);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
});

/**
 * Wrote this so I don't have to rewrite it in each test case.
 * @returns {object} {db, conn}
 */
const connectToDb = async () => {
  let connection = await MongoClient.connect(mongoConfig.serverUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return {
    db: await connection.db(mongoConfig.database),
    conn: connection,
    client: redis.createClient()
  };
};

/**
 * Drops database and closes the connection
 * @param {object} db
 * @param {object} conn
 */
const cleanUp = async (db, conn, client) => {
  await db.dropDatabase();
  await conn.close();
  if (client) {
    await client.flushallAsync();
    await client.quitAsync();
  }
};

// // add a post
// describe("insert", () => {
//   it("should add a post")
// })
describe("Post CRUD", () => {
  let db;
  let conn;

  beforeAll(async () => {
    ({ db, conn } = await connectToDb());
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  });

  let locationId;
  let location;
  let postId1;

  it("should add a location", async () => {
    let body = {
      name: "Gavin's Cave",
      location: [69, 69],
      description: "Dark and moist",
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/locations/add").send(body);
      locationId = response.body._id;
      location = response.body.location;
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
  it("should add a post", async () => {
    let body = {
      posterName: "Big Dum Dum",
      title: "What a big cave",
      locationId: locationId,
      location: [1, 1],
      content: "Its so cavernous in here, I want to set up a fire.",
      date: new Date(),
      rating: 4.5,
      tags: ["Eating Spot"],
    };
    try {
      const response = await request(app).post("/posts/add").send(body);
      postId1 = response.body._id;

      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
  it("should add another post", async () => {
    let body = {
      posterName: "Small Dum Dum",
      title: "I don't like this cave, it smells funny.",
      locationId: locationId,
      location: location,
      content: "The smell is overwhelming, I feel like I will faint.",
      date: new Date(),
      rating: 1.5,
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/posts/add").send(body);
      expect(response.body.posterName).toEqual(body.posterName);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
  it("should retrieve added post by id", async () => {
    try {
      const response = await request(app).get("/posts/byId/" + postId1);
      expect(response.body._id).toEqual(postId1);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
  it("should add comment to post", async () => {
    let body = {
      postId: postId1,
      posterName: "Dimple",
      content: "No don't set it on fire!",
      date: new Date(),
    };
    try {
      const response = await request(app).post("/posts/addComment").send(body);
      expect(response.body.posterName).toEqual(body.posterName);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
  it("should update post", async () => {
    let body = {
      posterName: "Dimple",
    };
    try {
      const response = await request(app)
        .patch("/posts/update/" + postId1)
        .send(body);
      expect(response.body.posterName).toEqual(body.posterName);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
  it("should remove the added post", async () => {
    try {
      const response = await request(app).post("/posts/remove/" + postId1);
      expect(response.statusCode).toEqual(200);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
  it("should be unable to get the deleted post", async () => {
    try {
      const response = await request(app).get("/posts/byId/" + postId1);
    } catch (e) {
      expect(e.response.statusCode).toEqual(404);
    }
  });
});
describe("Post search", () => {
  let db, conn;

  beforeAll(async () => {
    ({ db, conn } = await connectToDb());
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  });
  let postId1;
  let postId2;
  let locationId;
  let location;
  it("should add a location", async () => {
    let body = {
      name: "Gavin's Cave",
      location: [69, 69],
      description: "Dark and moist",
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/locations/add").send(body);
      locationId = response.body._id;
      location = response.body.location;
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
  it("should successfully create two posts", async () => {
    let post1 = {
      posterName: "Big Dum Dum",
      title: "What a big cave",
      locationId: locationId,
      location: [1, 1],
      content: "Its so cavernous in here, I want to set up a fire.",
      date: new Date(),
      rating: 4.5,
      tags: ["Eating Spot"],
    };
    try {
      const response = await request(app).post("/posts/add").send(post1);
      postId1 = response.body._id;
      expect(response.body.name).toEqual(post1.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }

    let post2 = {
      posterName: "Small Dum Dum",
      title: "I don't like this cave, it smells funny.",
      locationId: locationId,
      location: location,
      content: "The smell is overwhelming, I feel like I will faint.",
      date: new Date(),
      rating: 1.5,
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/posts/add").send(post2);
      postId2 = response.body._id;
      expect(response.body.name).toEqual(post2.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should successfully find post1 from a term search", async () => {
    const body = {
      term: "cave",
    };

    try {
      const response = await request(app).post("/posts/search").send(body);
      expect(response.body[0]._id).toEqual(postId1);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });

  it("should successfully find loc2 from a tag search", async () => {
    const body = {
      term: "smell",
      tags: ["Dungeon"],
    };

    try {
      const response = await request(app).post("/posts/search").send(body);
      expect(response.body[0]._id).toEqual(postId2);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
});

describe("Post popularity", () => {
  let db, conn;

  beforeAll(async () => {
    ({ db, conn } = await connectToDb());
  });

  afterAll(async () => {
    await cleanUp(db, conn);
  });
  let postId1;
  let postId2;
  let locationId;
  let location;
  it("should add a location", async () => {
    let body = {
      name: "Gavin's Cave",
      location: [69, 69],
      description: "Dark and moist",
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/locations/add").send(body);
      locationId = response.body._id;
      location = response.body.location;
      expect(response.body.name).toEqual(body.name);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
  it("should successfully create two posts", async () => {
    let post1 = {
      posterName: "Big Dum Dum",
      title: "What a big cave",
      locationId: locationId,
      location: location,
      content: "Its so cavernous in here, I want to set up a fire.",
      date: new Date(),
      rating: 4.5,
      tags: ["Eating Spot"],
    };
    try {
      const response = await request(app).post("/posts/add").send(post1);
      postId1 = response.body._id;
      expect(response.body.name).toEqual(post1.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }

    let post2 = {
      posterName: "Small Dum Dum",
      title: "I don't like this cave, it smells funny.",
      locationId: locationId,
      location: location,
      content: "The smell is overwhelming, I feel like I will faint.",
      date: new Date(),
      rating: 1.5,
      tags: ["Dungeon"],
    };
    try {
      const response = await request(app).post("/posts/add").send(post2);
      postId2 = response.body._id;
      expect(response.body.name).toEqual(post2.name);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
  it("should add comment to post", async () => {
    let body = {
      postId: postId1,
      posterName: "Dimple",
      content: "No don't set it on fire!",
      date: new Date(),
    };
    try {
      const response = await request(app).post("/posts/addComment").send(body);
      expect(response.body.posterName).toEqual(body.posterName);
    } catch (e) {
      console.log(e);
      expect(e).toBeFalsy();
    }
  });
  it("should find popular post", async () => {
    try {
      const response = await request(app).get("/posts/popular");

      expect(response.body[0]).toEqual(postId1);
    } catch (e) {
      expect(e).toMatch("nothing because this shouldnt fail");
    }
  });
});
