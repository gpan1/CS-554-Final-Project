const posts = require('./posts')
const locations = require('./locations')

const test = async () => {

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
        console.log("Created post: \n" + newPost);
    } catch (e) {
        console.log(e);
    }

    try {
        const allPosts = await posts.getAll();
        console.log("All posts: \n" + allPosts);
    }

    try {
        const allLocations = await locations.getAll();
        console.log("All locations: \n" + allLocations);
    }
}

module.exports = {
    test
}