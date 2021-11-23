const posts = require('./posts')
const locations = require('./locations')
const mongoConnection = require('../config/mongoConnection')

const test = async () => {

    const _db = await mongoConnection();
    await _db.dropDatabase();

    let result = {};

    const location = {
        lat: 69,
        lng: 69
    }

    const post = {
        posterName: 'archibald',
        title: 'post title',
        content: 'post content',
        date: new Date(),
        location
    };

    try {
        const newPost = await posts.create(post);
        result.newPost = newPost;
    } catch (e) {
        result.newPost = e;
        console.log(e);
    }

    try {
        const allPosts = await posts.getAll();
        result.allPosts = allPosts;
    } catch (e) {
        result.allPosts = e;
        console.log("Failed to get all posts: " + e);
    }

    try {
        const allLocations = await locations.getAll();
        result.allLocations = allLocations;
    } catch (e) {
        result.allLocations = e;
        console.log("Failed to get all locations: " + e);
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