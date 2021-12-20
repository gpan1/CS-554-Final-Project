// This is a test script using Jest. Jest is a test automation platform that supports TDD and BDD. This file tests the databases.

const { MongoClient } = require("mongodb");
const settings = require("../config/settings.json");
const mongoConfig = settings.mongoConfig;
const locData = require("../data/locations");
const postsData = require("../data/posts");

const redis = require("redis");
const bluebird = require("bluebird");
let client;
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let locationId;
// Test to add a post.
describe("post operations", () => {
  let connection;
  let db;

  beforeAll(async () => {
    client = redis.createClient();
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
    await client.flushallAsync();
    await client.quitAsync();
  });
  it("should insert a location into database", async () => {
    const loc = await locData.create({
      name: "TEEMO",
      description: "x",
      date: new Date(),
      location: [69, 69]
    });
    
    console.log(loc);
    locationId = loc._id;
    expect(loc.name).toEqual("TEEMO");
  });
  it("should insert a post into database", async () => {
    const insertedPost = await postsData.create({
      posterName: "TEEMO",
      title: "What a big cave",
      locationId: locationId,
      content: "Its so cavernous in here, I want to set up a fire.",
      date: new Date(),
      rating: 4.5,
      tags: ["Eating Spot"],
    });
    expect(insertedPost.posterName).toEqual("TEEMO");
  });
  it("should get all posts in database", async () => {
    try {
      await postsData.create({
        posterName: "TEEMO",
        title: "x",
        date: new Date(),
        content: "xxxx",
        rating: 5,
        location: [1, 2],
        locationId: locationId
      });
      const data = await postsData.getAll();
      expect(data.length>1);
    } catch (e) {
      expect(e).toMatch("Error: Could not get all posts.");
    }
  });
  it("should be getting a post by id", async () => {
    try {
      const p1 = await postsData.create({
        posterName: "ADAM",
        title: "x",
        date: new Date(),
        content: "xxxx",
        rating: 5,
        location: [1, 2],
        locationId: locationId
      });
      const adam = await postsData.getPostById(p1._id);
      expect(adam.posterName).toEqual("ADAM");
    } catch (e) {
      expect(e).toMatch("Error: Could not get the right post");
    }
  });
  it("should be adding a comment to a post", async () => {
    try {
      await postsData.create({
        posterName: "TEEMO",
        title: "x",
        date: new Date(),
        content: "xxxx",
        rating: 5,
        location: [1, 2],
        locationId: locationId
      });
      const data = await postsData.getAll();
      const adam = await postsData.addComment({
        postId: data[0]._id,
        posterName: "ADAM",
        content: "ADAM STINKY",
        date: new Date(),
      });
      expect(adam.content).toEqual("ADAM STINKY");
    } catch (e) {
      expect(e).toMatch("Error: Could not add comment to post");
    }
  });
  // it("should be removing a post", async () => {
  //   try {
  //     const r1 = await postsData.create({
  //       posterName: "TEEMO",
  //       title: "x",
  //       date: new Date(),
  //       content: "xxxx",
  //       rating: 5,
  //       location: [1, 2],
  //       locationId: locationId,
  //     });
  //     const adam = postsData.remove(r1._id);
  //     let x = "";
  //     if (adam) {
  //       x = "stinky";
  //     }
  //     expect(x).toEqual("stinky");
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not remove post");
  //   }
  // });
  // it("should be updating a post", async () => {
  //   try {
  //     const u1 = await postsData.create({
  //       posterName: "TEEMO",
  //       title: "x",
  //       date: new Date(),
  //       content: "xxxx",
  //       rating: 5,
  //       location: [1, 2],
  //       locationId: locationId
  //     });
  //     const adam = await postsData.update(u1._id, {
  //       posterName: "stinky",
  //     });
  //     console.log(adam);
  //     expect(adam.posterName).toEqual("stinky");
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not update post");
  //   }
  // });
  
  // it("should be adding a post ID to a location", async () => {
  //   try {
  //     const p1 = await postsData.create({
  //       posterName: "TEEMO",
  //       title: "x",
  //       date: new Date(),
  //       content: "xxxx",
  //       rating: 5,
  //       location: [1, 2],
  //       locationId: locationId,
  //     });
  //     console.log(p1);
  //     const {value} = await locData.addPost(
  //       locationId,
  //       p1._id
  //     );
  //     console.log(value);
  //     if (value) {
  //       x = "stinky";
  //     }
  //     expect(x).toEqual("stinky");
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not add a post ID to a location");
  //   }
  // });
  // it("should be adding a post to the popular cache", async () => {
  //   try {
  //     const post = await postsData.create({
  //       posterName: "TEEMO",
  //       title: "x",
  //       date: new Date(),
  //       content: "xxxx",
  //       rating: 5,
  //       location: [1, 2],
  //       locationId: locationId,
  //     });
  //     const posts = await postsData.getPopularPosts();
  //     expect(posts[0]).toBe(post._id);
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not add a post ID to a location");
  //   }
  // });
  // it("should be incrementing popularity based on getting the id", async () => {
  //   try {
  //     const id = await locData.create({
  //       description: "asdasdda",
  //       name: "TEEMO",
  //       location: [1, 2],
  //     });
  //     await postsData.create({
  //       posterName: "ADAM",
  //       title: "xx",
  //       date: new Date(),
  //       content: "xxxxx",
  //       rating: 5,
  //       location: [3, 4],
  //       locationId: id._id,
  //     });
  //     await postsData.create({
  //       posterName: "TEEMO",
  //       title: "x",
  //       date: new Date(),
  //       content: "xxxx",
  //       rating: 5,
  //       location: [1, 2],
  //       locationId: id._id,
  //     });
  //     const data = await postsData.getAll();
  //     await postsData.getPostById(data[0]._id);
  //     await postsData.getPostById(data[1]._id);
  //     const result = await postsData.getPostById(data[1]._id);
  //     const posts = await postsData.getPopularPosts();
  //     expect(posts[0]).toBe(result._id);
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not add a post ID to a location");
  //   }
  // });
});







// // Testing searching by title
describe("Location operations", () => {
  let connection;
  let db;

  beforeAll(async () => {
    client = redis.createClient();
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
    await client.flushallAsync();
    await client.quitAsync();
  });
  it("should insert a location into database", async () => {
    const insertedLoc = await locData.create({
      description: "asdasda",
      name: "TEEMO",
      location: [1, 2],
    });
    expect(insertedLoc.name).toEqual("TEEMO");
  });
  it("should get all locations in database", async () => {
    try {
      await locData.create({
        description: "asdasda",
        name: "TEEMO",
        location: [1, 2],
      });
      const data = await locData.getAll();
      expect(data[0].name).toEqual("TEEMO");
    } catch (e) {
      expect(e).toMatch("Error: Could not get all locations.");
    }
  });
  it("should be getting a location by id", async () => {
    try {
      let l1 = await locData.create({
        description: "asdasdda",
        name: "TEEMO",
        location: [1, 2],
      });
      const adam = await locData.getLocById(l1._id);
      expect(adam.name).toEqual("TEEMO");
    } catch (e) {
      expect(e).toMatch("Error: Could not get the right location");
    }
  });
  // it("should be removing a location", async () => {
  //   try {
  //     await locData.create({
  //       description: "asdasdda",
  //       name: "TEEMO",
  //       location: [1, 2],
  //     });
  //     await locData.create({
  //       description: "asdasda",
  //       name: "ADAM",
  //       location: [3, 4],
  //     });
  //     const data = await locData.getAll();
  //     const adam = locData.remove(data[1]._id);
  //     let x = "";
  //     if (adam) {
  //       x = "stinky";
  //     }
  //     expect(x).toEqual("stinky");
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not remove location");
  //   }
  // });
  // it("should be updating a location", async () => {
  //   try {
  //     await locData.create({
  //       description: "asdasdda",
  //       name: "TEEMO",
  //       location: [1, 2],
  //     });
  //     const data = await locData.getAll();
  //     const adam = await locData.update(data[0]._id.toString(), {
  //       name: "stinky",
  //     });
  //     expect(adam.name).toEqual("stinky");
  //   } catch (e) {
  //     expect(e).toMatch("Error: Could not update location");
  //   }
  // });
  it("should be getting the correct post from the title search parameters", async () => {
    try {
      const id = await locData.create({
        name: "Babbio",
        location: [1, 1],
        tags: ["Building"],
        description:
          "Academic building located at the southside of Campus, mainly used for Businees Tech classes.",
      });
      const p1 = await postsData.create({
        posterName: "J",
        title: "Babbio big",
        content: "This building can fit so many gamers in it",
        date: new Date(),
        locationId: id._id,
        location: [0, 1],
        tags: ["Building"],
        rating: 5,
      });
      await postsData.create({
        posterName: "J",
        title: "Dabbio",
        content: "Oops, a typo.",
        date: new Date(),
        location: [0, 0],
        locationId: id._id,
        tags: ["Building"],
        rating: 3.5,
      });

      const s1 = await postsData.postSearch({
        term: "Ba",
        tags: ["Building", "Eating Spot"],
        sort: ["title", 1],
      });
      expect(s1[0]._id).toBe(p1._id);
    } catch (e) {
      expect(e).toMatch("Error: Could not add a post ID to a location");
    }
  });
});

// Testing tag searching
describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    client = redis.createClient();
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
    await client.flushallAsync();
    await client.quitAsync();
  });

  it("should be getting the correct post from the tags search parameters", async () => {
    try {
      const id = await locData.create({
        name: "Babbio",
        location: [1, 1],
        tags: ["Building"],
        description:
          "Academic building located at the southside of Campus, mainly used for Businees Tech classes.",
      });
      const p1 = await postsData.create({
        posterName: "J",
        title: "Babbio big",
        content: "This building can fit so many gamers in it",
        date: new Date(),
        locationId: id._id,
        location: [0, 1],
        tags: ["Building"],
        rating: 5,
      });
      await postsData.create({
        posterName: "J",
        title: "Baabbio",
        content: "Oops, a typo.",
        date: new Date(),
        location: [0, 0],
        locationId: id._id,
        tags: ["Professor"],
        rating: 3.5,
      });

      const s1 = await postsData.postSearch({
        term: "Ba",
        tags: ["Building", "Eating Spot"],
        sort: ["title", 1],
      });
      expect(s1[0]._id).toBe(p1._id);
    } catch (e) {
      expect(e).toMatch("Error: Could not add a post ID to a location");
    }
  });
});

// Testing sorting when searching.
describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    client = redis.createClient();
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
    await client.flushallAsync();
    await client.quitAsync();
  });

  it("should be getting the correct post from the search parameters in the correct order", async () => {
    try {
      const id = await locData.create({
        name: "Babbio",
        location: [1, 1],
        tags: ["Building"],
        description:
          "Academic building located at the southside of Campus, mainly used for Businees Tech classes.",
      });
      await postsData.create({
        posterName: "J",
        title: "Babbio big",
        content: "This building can fit so many gamers in it",
        date: new Date(),
        locationId: id._id,
        location: [0, 1],
        tags: ["Building"],
        rating: 5,
      });
      const p2 = await postsData.create({
        posterName: "J",
        title: "Baabbio",
        content: "Oops, a typo.",
        date: new Date(),
        location: [0, 0],
        locationId: id._id,
        tags: ["Building"],
        rating: 3.5,
      });

      const s1 = await postsData.postSearch({
        term: "Ba",
        tags: ["Building", "Eating Spot"],
        sort: ["title", 1],
      });
      expect(s1[0]._id).toBe(p2._id);
    } catch (e) {
      expect(e).toMatch("Error: Could not add a post ID to a location");
    }
  });
});
