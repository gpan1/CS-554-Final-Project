const {checkPost, validateLocation, checkId, idToStr, checkComment, validateStr} = require('../util')
const { posts } = require('../config/mongoCollections');
const {create: createLocation, addId: addPostIdToLocation} = require('./locations');
const { ObjectId } = require('mongodb');

const getAll = async () => {
    let postCol = await posts();
    let all = await postCol.find({}).toArray();
    return all.map(x => idToStr(x));
}
const getPostById = async (id) => {
    try{
        let parsedId = checkId(id);
        let postCol = await posts();
        const post = await postCol.findOne({ _id: parsedId });
        if (post === null) throw Error('No post with that id');
        return post;
    } catch(e){
        console.log(`Get post by id failed: ${e}`);
        return {error: e};
    }
}
const searchByTitle = async (term) => {
    let res = [];
    try{
        validateStr(term);
        let postCol = await posts();
        const post = await postCol.find({ "title": { $regex: `${term}` }});
        if (post === null) throw Error('No post match');
        await post.forEach((x)=>{
            res.push(idToStr(x));
        } );
        // await post.forEach(console.log);
        return res;
    } catch(e){
        console.log(`Post search by title failed: ${e}`);
        return {error: e};
    }
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

const addComment = async (args) => {
    // comments are stored in an array, with each comment stored in a 
    // {_id: ObjectId, name: string, body: string} object
    let commentObj;
    let parsedId;
    try {
        parsedId = checkId(args.postId);
        await getPostById(args.postId);
        commentObj = {
            ...checkComment(args, true),
            _id: ObjectId()
        };
    } catch (e) {
        console.log(`Creating comment failed: ${e}`);
        return {error: e};
    }
    const postCol = await posts();
    const updateInfo = await postCol.updateOne(
      { _id: parsedId },
      { $addToSet: { comments: commentObj } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw Error("Failed to add comment");
    
    return idToStr(commentObj);
}
module.exports = {
    getAll,
    create,
    addComment,
    getPostById,
    searchByTitle
    // getByPosterName
}