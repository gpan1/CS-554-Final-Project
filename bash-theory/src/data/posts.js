const {checkPost, validateLocation, checkId, idToStr} = require('../util')
const { posts } = require('../config/mongoCollections');
const {create: createLocation, addId: addPostIdToLocation} = require('./locations');

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
    const { insertedId } = await postCol.insertOne(newObj);
    if (!insertedId) throw Error("Failed to create post");
    newObj._id = insertedId.toString();

    // if location hasn't been added, attempt adding
    if (args.location && validateLocation(args.location)) {
        // if location already exists, inserting it will throw which is fine
        try {
            const loc = await createLocation({...args.location}, insertedId.toString());
            console.info(`Added location with id ${loc._id}`);
        // if it already exists, we need to add this post's id to the locations'
        // list of posts
        } catch (e) {
            console.log(e);
            const updatedLoc = await addPostIdToLocation(newObj.location, newObj._id);
            console.debug(`Added post ${newObj._id} to location`);
        }
    }

    return idToStr(newObj);
}

module.exports = {
    getAll,
    create
    // getById,
    // getByPosterName
}