const posts = require('./posts')
const locations = require('./locations')
const mongoConnection = require('../config/mongoConnection')

const test = async () => {

    const _db = await mongoConnection.connectToDb();
    await _db.dropDatabase();

    let result = {};

    const newLocation = {
      name: 'obagel',
      location: [69, 69],
      description: 'some bagels here'
    };

    try {
      const newLoc = await locations.create(newLocation);
      result.createLocation = newLoc;
    } catch (e) {
      result.createLocation = e;
    }

    // attempt to make a duplicate location
    // should fail due to unique index constraint on longtitude and latitude
    // try {
    //   await locations.create(newLocation);
    //   result.duplicateLocations = true;
    // } catch (e) {
    //   result.duplicateLocations = false;
    // }

    const post = {
        posterName: 'archibald',
        title: 'post title',
        content: 'post content',
        date: new Date(),
        location: [69, 69]
    };

    try {
        const newPost = await posts.create(post);
        result.createPost = newPost;
    } catch (e) {
        result.createPost = e;
    }


    try {
        const allPosts = await posts.getAll();
        result.allPosts = allPosts;
    } catch (e) {
        result.allPosts = e;
    }

    try {
        const allLocations = await locations.getAll();
        result.allLocations = allLocations;
    } catch (e) {
        result.allLocations = e;
    }

    return result;
}

const main = () => {
    test().then(r => console.log(r));
}

main();

module.exports = {
    test
}