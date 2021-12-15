const {validateLocation, checkId } = require('../util')
const { locations } = require('../config/mongoCollections');

/**
 * Location schema:
 * coords!: [Number, Number]    \\ (longitude, latitude)
 * name!: String
 * posts!: [ID]                 \\ can be empty list
 * description?: String
 */

/**
 * Valid coordinate ranges:
 * longitude: [-180, 180]
 * latitude: [-90, 90]
 */

// returns all locations
const getAll = async () => {
    let locCol = await locations();
    let all = await locCol.find({}).toArray();
    return all;
}

// tries to add a post ID to a location
const addId = async (location, postId) => {
    if (!validateLocation(location)) throw TypeError("Invalid location");
    if (!postId) throw TypeError("No post id given");

    const locs = await locations();

    try {
        let _postId = checkId(postId);
        const updateResult = locs.findOneAndUpdate(
            {lng: location.lng, lat: location.lat},
            { $push: {posts: _postId}},
            { returnNewDocument: true });
        if (!updateResult) throw Error("Failed to add post to location");
        return updateResult;
    } catch (e) {
        throw Error("Failed to add post to location: " + e);
    };
}

const create = async (args, postId=undefined) => {

    console.log('create loc args: ' + JSON.stringify(args));
    if (!args
        || !validateLocation(args))
        throw TypeError("Invalid location args");

    let newObj = {
        location: args.location,
    };

    // if post id supplied, add it to list of posts
    if (postId) {
        try {
            let _postId = checkId(postId);
            newObj.posts = [_postId];
        } catch (e) { throw TypeError("Invalid postId"); }
    }

    if (postId && checkId(postId)) newObj.posts = [checkId(postId)];

    const locCol = await locations();
    const { insertedId } = await locCol.insertOne(newObj, 
        // since uniqueness is constrained by (lat, lng) pair, no need for ObjectID
        {forceServerOjbectId: false});
    if (!insertedId) throw Error("Failed to create location");

    return newObj;
}

module.exports = {
    getAll,
    create,
    addId
    // getById,
    // getByPosterName
}