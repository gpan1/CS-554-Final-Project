const {checkPost, checkId, idToStr} = require('../util')
const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;

const getAll = async () => {
    let postCol = await posts();
    let all = await postCol.find({}).toArray();
    return all.map(x => idToStr(x));
}

const create = async (args) => {
    let newObj;
    try {
        newObj = {
            ...checkPost(args, true),
            comments: []
        };
    } catch (e) {
        console.log(`Creating post failed: ${e}`);
        return {error: e};
    }

    const postCol = await posts();
    const result = await postCol.insertOne(newObj);
    if (result.ops.length === 0) return {error: "Failed to add post"}

    return idToStr(...result.ops);
}

module.exports = {
    getAll,
    create
    // getById,
    // getByPosterName
}