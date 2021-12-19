const {checkPost, validateLocation, checkId, validateNum, 
  idToStr, checkComment, validateStr, 
  validateCoordinates, validateArray, validateUrl} = require('../util')
const { posts } = require('../config/mongoCollections');
// const {create: createLocation, addId: addPostIdToLocation} = require('./locations');
const locations = require("./locations");
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
/**
* Does the same thing as getPostById but doesn't increment redis post count for popular posts
* Can be used in update or delete functions to check if post id is valid
* @return {object}
*/
const postById = async (id) => {
    try{
        let parsedId = checkId(id);
        let postCol = await posts();
        const post = await postCol.findOne({ _id: parsedId });
        if (post === null) throw Error('No post with that id');
        return idToStr(post);
    } catch(e) {
        console.log(`Get post by id failed: ${e}`);
        return {error: e};
    }
}
/**
* Checks if the post id is valid and returns with the post if it exists
* Also increments the redis post count for popular posts as someone has visited the post
* @param {string}
* @return {object}
*/
const getPostById = async (id) => {
  try {
    let parsedId = checkId(id);
    let postCol = await posts();
    const post = await postCol.findOne({ _id: parsedId });
    if (post === null) throw Error('No post with that id');
    await client.zincrbyAsync('popular', 1, id);
    return idToStr(post);
  } catch (e) {
    console.log(`Get post by id failed: ${e}`);
    return { error: e };
  }
}
/**
* Gets the posts that have are most visited using redis
* @return {Array} array of most popular posts capped at length 20
*/
const getPopularPosts = async () => {
    try{
        let popularCache = await client.zrangebyscoreAsync('popular', 0, 'inf');
        if (popularCache.length === 0){
            throw `No posts available.`
        }
        let popularArr = popularCache.reverse();
        if (popularArr.length > 20){
            popularArr = popularArr.slice(0,20);
        }
        return popularArr;
    } catch(e){
        console.log(`Get popular post failed: ${e}`);
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
            sort: sorting
            // projection: { _id: 0, title: 1, imdb: 1 },
          };
        const post = await postCol.find(query,options);
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
        const loc = await locations.getLocById(newObj.locationId);
        newObj.locationId = ObjectId(newObj.locationId);
        
    } catch (e) {
        console.log(`Creating post failed: ${e}`);
        return { error: e };
    }
    const postCol = await posts();
    const { insertedId } = await postCol.insertOne(newObj);
    if (!insertedId) throw Error("Failed to create post");
    const res = idToStr(newObj);
    await locations.addPost(res.locationId,res._id);
    // do not attempt adding location when a post is made for a nonexisting one

    // // if location hasn't been added, attempt adding
    // if (args.location && validateLocation(args.location)) {
    //     // if location already exists, inserting it will throw which is fine
    //     try {
    //         const loc = await createLocation({...args.location}, insertedId.toString());
    //         console.info(`Added location with id ${loc._id}`);
    //     // if it already exists, we need to add this post's id to the locations'
    //     // list of posts
    //     } catch (e) {
    //         console.log(e);
    //         const updatedLoc = await addPostIdToLocation(newObj.location, newObj._id);
    //         console.debug(`Added post ${newObj._id} to location`);
    //     }
    // }
    await client.zaddAsync('popular', 1, newObj._id);
    return res;
}

const addComment = async (args) => {
    // comments are stored in an array, with each comment stored in a 
    // {_id: ObjectId, name: string, body: string} object
    let commentObj;
    let parsedId;
    try {
        parsedId = checkId(args.postId);
        await getPostById(args.postId);
        // await checkPostId(args.postId);
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

/**
 * Given a list of one or more tags, returns all posts that match the tags
 * Note: this attempts to match ALL given tags; if a post doesn't have ALL
 * the supplied tags, it will not be included in the result
 * @param {[string]} tags
 * @returns All posts matching the tags
 * @throws TypeError on invalid input 
 */
const getPostsByTags = async (tags) => {
  if (!Array.isArray(tags)) 
    throw TypeError(`Expected array, got ${tags ? tags : 'nothing'}`);

  // validate every tag
  if (!validateArray(tags, validateStr))
    throw TypeError("getPostsByTags: not all tags passed string check");

  const postCol = await posts();
  try {
    const matches = await postCol.find({
      tags: {
        $all: tags
      }
    }).toArray();
    return matches.map(x => idToStr(x));  
  } catch (e) {
    console.log('getPostsByTags encountered error: ', JSON.stringify(e));
  };
}

/**
 * Patches a post with given (string) ID
 * @param {string} id
 * @param {object} args  
 * @returns {object} updated post
 */
const update = async (id, args) => {
  if (!id) 
    throw TypeError("post update: expected id");

  const parsedId = checkId(id);

  if (JSON.stringify(args) === "{}") 
    throw TypeError("post update: expected update args");

  const updateObj = {};
  if (args.title) {
    if (!validateStr(args.title))
      throw TypeError(`post update invalid title: ${args.title}`);
    updateObj.title = args.title;
  }

  if (args.content) {
    if (!validateStr(args.content)) 
      throw TypeError(`post update invalid content: ${args.content}`);
    updateObj.content = args.content;
  }

  if (args.location) {
    if (!validateCoordinates(args.location))
      throw TypeError(`post update invalid location: ${args.location}`);
    updateObj.location = args.location;
  }

  if (args.posterName) {
    if (!validateStr(args.posterName))
      throw TypeError(`post update invalid posterName: ${args.posterName}`);
    updateObj.posterName = args.posterName;
  }

  if (args.rating) {
    if (!validateNum(args.rating)) 
      throw TypeError(`post update invalid rating: ${args.rating}`);
    updateObj.rating = args.rating;
  }

  if (args.tags) {
    if (!validateArray(args.tags, validateStr))
      throw TypeError(`post update invalid tags: ${tags}`);
    updateObj.tags = args.tags;
  }

  if (args.imgUrl) {
    if (!validateUrl(args.imageUrl))
      throw TypeError(`post update invalid image url: ${args.imgUrl}`);
    newObj.imgUrl = args.imgUrl;
  }

  const postCol = await posts();
  try {
    const result = await postCol.findOneAndUpdate(
      {_id: parsedId},
      {$set: updateObj},
      {returnOriginal: false}
    );

    if (!result.value)
      throw Error('Document not found');

    return idToStr(result.value);
  } catch (e) {
    console.log('post update encountered error: ', JSON.stringify(e));
  }
}

/**
 * Removes post with given ID, if found
 * @param {string} postId 
 * @returns {boolean} whether or not a post was deleted
 */
const remove = async (postId) => {
  let parsedId = checkId(postId);
  const postCol = await posts();
  try {
    let result = await postCol.deleteOne({_id: parsedId});
    if (result.deletedCount == 0)
      return false;
    return true;
  } catch (e) {
    console.error(`remove encountered error: ${JSON.stringify(e)}`);
    return false;
  }
}

// /**
//  * @param coordinate-pair
//  * @returns all posts within 1 meter of coordinates 
//  */
// const getPostsByLocation = async (location) => {
//   if (!validateCoordinates(location)) 
//     throw TypeError("Invalid location");

//   // search for points within 1 meter of given location
//   const query = {
//     location: {
//       $near: {
//         $geometry: {
//           type: "Point",
//           coordinates: location
//         },
//         $maxDistance: 1,
//         $minDistance: 0
//       }
//     }
//   };

//   const postCol = await posts();

//   try {
//     const matches = await postCol.find(query).toArray();  
//     return matches;
//   } catch (e) {
//     console.log(e);
//   }
// };

module.exports = {
    getAll,
    create,
    addComment,
    getPostById,
    postSearch,
    getPopularPosts,
    getPostsByTags,
    update,
    remove,
    postById
    // getPostsByLocation
    // getByPosterName
}