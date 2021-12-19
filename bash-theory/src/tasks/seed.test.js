// This is a test script using Jest. Jest is a test automation platform that supports TDD and BDD. This file tests the databases.

const { MongoClient } = require("mongodb");
const settings = require("../config/settings.json");
const mongoConfig = settings.mongoConfig;
const locData = require("../data/locations");
const postsData = require("../data/posts");

// Test to add a post.
describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();

  });

  it("should insert a post into database", async () => {
    const insertedPost = await postsData.create({
    posterName: "TEEMO",
    title: "x",
    date: new Date(),
    content: "xxxx",
    rating: 5,
    location: [1, 2],
    locationId: "507f191e810c19729de860ea"
    }
    );
    expect(insertedPost.posterName).toEqual("TEEMO");
  });

});

// Test getting all Posts.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
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
            locationId: "507f191e810c19729de860ea"
            });
        const data = await postsData.getAll();
        expect(data[0].posterName).toEqual("TEEMO");
      } catch (e) {
        expect(e).toMatch("Error: Could not get all posts.");
      }
    });
  });

  //Test getting a post by id.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be getting a post by id", async () => {
      try { 
        await postsData.create({
            posterName: "TEEMO",
            title: "x",
            date: new Date(),
            content: "xxxx",
            rating: 5,
            location: [1, 2],
            locationId: "507f191e810c19729de860ea"
            });
        await postsData.create({
            posterName: "ADAM",
            title: "xx",
            date: new Date(),
            content: "xxxxx",
            rating: 5,
            location: [3, 4],
            locationId: "507f191e810c19729de861ea"
            });
        const data = await postsData.getAll();
        const adam = await postsData.getPostById(data[1]._id);
        expect(adam.posterName).toEqual("ADAM");
      } catch (e) {
        expect(e).toMatch("Error: Could not get the right post");
      }
    });
  });

    //Test adding a comment to a post.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
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
            locationId: "507f191e810c19729de860ea"
            });
        const data = await postsData.getAll();
        const adam = await postsData.addComment({
            postId: data[0]._id,
            posterName: "ADAM",
            content: "ADAM STINKY",
            date: new Date()
        });
        expect(adam.content).toEqual("ADAM STINKY");
      } catch (e) {
        expect(e).toMatch("Error: Could not add comment to post");
      }
    });
  });

  //Test removing a post.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be removing a post", async () => {
      try { 
        await postsData.create({
            posterName: "TEEMO",
            title: "x",
            date: new Date(),
            content: "xxxx",
            rating: 5,
            location: [1, 2],
            locationId: "507f191e810c19729de860ea"
            });
        await postsData.create({
            posterName: "ADAM",
            title: "xx",
            date: new Date(),
            content: "xxxxx",
            rating: 5,
            location: [3, 4],
            locationId: "507f191e810c19729de861ea"
            });
        const data = await postsData.getAll();
        const adam = postsData.remove(data[1]._id);
        let x = "";
        if(adam)
        {
            x = "stinky"
        }
        expect(x).toEqual("stinky");
      } catch (e) {
        expect(e).toMatch("Error: Could not remove post");
      }
    });
  });

    //Test updating a post.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be updating a post", async () => {
      try { 
        await postsData.create({
            posterName: "TEEMO",
            title: "x",
            date: new Date(),
            content: "xxxx",
            rating: 5,
            location: [1, 2],
            locationId: "507f191e810c19729de860ea"
            });
        const data = await postsData.getAll();
        const adam = await postsData.update(data[0]._id, {posterName: 'stinky'});
        console.log(adam);
        expect(adam.posterName).toEqual("stinky");
      } catch (e) {
        expect(e).toMatch("Error: Could not update post");
      }
    });
  });

  // Test to add a location.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
  
    });
  
    it("should insert a location into database", async () => {
      const insertedLoc = await locData.create({
        description: "asdasda",
        name: "TEEMO",
        location: [1, 2]
      }
      );
      expect(insertedLoc.name).toEqual("TEEMO");
    });
  
  });

  // Test getting all Locations.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should get all locations in database", async () => {
      try { 
        await locData.create({
            description: "asdasda",
            name: "TEEMO",
            location: [1, 2]
        });
        const data = await locData.getAll();
        expect(data[0].name).toEqual("TEEMO");
      } catch (e) {
        expect(e).toMatch("Error: Could not get all locations.");
      }
    });
  });

//Test getting a location by id.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be getting a location by id", async () => {
      try { 
        await locData.create({
            description: "asdasdda",
            name: "TEEMO",
            location: [1, 2]
        });
        await locData.create({
            description: "asdasda",
            name: "ADAM",
            location: [3, 4]
        });
        const data = await locData.getAll();
        const adam = await locData.getLocById(data[1]._id.toString());
        expect(adam.name).toEqual("ADAM");
      } catch (e) {
        expect(e).toMatch("Error: Could not get the right location");
      }
    });
  });

  //Test removing a location.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be removing a location", async () => {
      try { 
        await locData.create({
            description: "asdasdda",
            name: "TEEMO",
            location: [1, 2]
        });
        await locData.create({
            description: "asdasda",
            name: "ADAM",
            location: [3, 4]
        });
        const data = await locData.getAll();
        const adam = locData.remove(data[1]._id);
        let x = "";
        if(adam)
        {
            x = "stinky"
        }
        expect(x).toEqual("stinky");
      } catch (e) {
        expect(e).toMatch("Error: Could not remove location");
      }
    });
  });

  //Test updating a location.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be updating a location", async () => {
      try { 
        await locData.create({
            description: "asdasdda",
            name: "TEEMO",
            location: [1, 2]
        });
        const data = await locData.getAll();
        const adam = await locData.update(data[0]._id.toString(), {name: 'stinky'});
        expect(adam.name).toEqual("stinky");
      } catch (e) {
        expect(e).toMatch("Error: Could not update location");
      }
    });
  });

   //Test adding a post ID to a location.
describe("insert", () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db(mongoConfig.database);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await connection.close();
    });
  
    it("should be adding a post ID to a location", async () => {
      try { 
        await locData.create({
            description: "asdasdda",
            name: "TEEMO",
            location: [1, 2]
        });
        await postsData.create({
            posterName: "TEEMO",
            title: "x",
            date: new Date(),
            content: "xxxx",
            rating: 5,
            location: [1, 2],
            locationId: "507f191e810c19729de860ea"
            });
        const data = await locData.getAll();
        const data2 = await postsData.getAll();
        const adam = await locData.addPost(data[0]._id.toString(), data2[0]._id.toString());
        if(adam)
        {
            x = "stinky"
        }
        expect(x).toEqual("stinky");
      } catch (e) {
        expect(e).toMatch("Error: Could not add a post ID to a location");
      }
    });
  });




