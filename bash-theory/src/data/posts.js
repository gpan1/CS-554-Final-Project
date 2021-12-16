const {checkPost, validateLocation, checkId, idToStr, checkComment, validateStr} = require('../util')
const { posts } = require('../config/mongoCollections');
const {create: createLocation, addId: addPostIdToLocation} = require('./locations');
const { ObjectId } = require('mongodb');

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const getAll = async () => {
    let postCol = await posts();
    let all = await postCol.find({}).toArray();
    return all.map(x => idToStr(x));
}
const checkPostId = async (id) => {
    try{
        let parsedId = checkId(id);
        let postCol = await posts();
        const post = await postCol.findOne({ _id: parsedId });
        if (post === null) throw Error('No post with that id');
        return true;
    } catch(e){
        console.log(`Get post by id failed: ${e}`);
        return {error: e};
    }
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
/**
* Takes in an object that must contain term to search for.
* Optional fields include tags in the form of an array, ie:['Building', 'Class'],
* and sorting options in the form of [sortingField, sortingOrder].
* SortingOrder: 1 is ascending, -1 is descending
* @param {object} 
* @return {Array} array of posts matching search
*/
const postSearch = async (args) => {
    let res = [];
    let tags = ['Building', 'Class', 'Eating Spot', 'Professor'];
    let sorting = { 'title': 1 };
    try{
        validateStr(args.term);
        if (args.tags){
            for (let t of args.tags){
                validateStr(t);
            }
            tags = args.tags;
        }
        // if sorting is provided it will be in the form [field, order]
        // for order: 1 is ascending, -1 is descending
        if (args.sort){
            if (!Array.isArray(args.sort)) throw TypeError(`Invalid sort: ${args.sort}`);
            validateStr(args.sort[0]);
            let order = 1;
            if (args.sort.length > 1){
                // if the sort option is invalid, just use default of 1
                if ((typeof(args.sort[1]) === 'number') && args.sort[1] === -1){
                    order = -1;
                }
            }
            sorting = {};
            sorting[`${args.sort[0]}`] = order;
        }
        let postCol = await posts();
        const query = { 
            "title": { $regex: `${args.term}` },
            "tags": { $in: tags }    
        };
        const options = {
            // sort returned documents in ascending order by title (A->Z)
            sort: { 'title': 1 }
            // projection: { _id: 0, title: 1, imdb: 1 },
          };
        const post = await postCol.find(query);
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
        await checkPostId(args.postId);
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
    postSearch
    // getByPosterName
}