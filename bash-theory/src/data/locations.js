const {validateLocation, checkId } = require('../util')
const { locations } = require('../config/mongoCollections');

const getAll = async () => {
    let locCol = await location();
    let all = await locCol.find({}).toArray();
    return all;
}

const addId = async (location, postId) => {
    if (!validateLocation) throw TypeError("Invalid location");
    if (!postId) throw TypeError("No post id given");

    try {
        let _postId = checkId(postId);
        const updateResult = locations.findOneAndUpdate(
            {lng: location.lng, lat: location.lat},
            { $push: {posts: _postId},
            { returnNewDocument: true }}
        );
        if (!updateResult) throw Error("Failed to add post to location");
        return updateResult;
    } catch (e) {
        throw Error("Failed to add post to location: " + e);
    };
}

const create = async (args, postId=undefined) => {
    if (!args
        || !args.location
        || !validateLocation(args.location))
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