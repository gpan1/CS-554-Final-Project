const posts = require('./posts')

const test = async () => {
    const post = {
        posterName: 'archibald',
        title: 'post title',
        content: 'post content',
        date: new Date(),
        location: {
            lat: 69,
            lng: 69
        }
    };

    try {
        const newPost = await posts.create(post);
        console.log(newPost);
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    test
}