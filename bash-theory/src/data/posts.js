const { checkPost, validateLocation, checkId, idToStr, checkComment } = require('../util')
const { posts } = require('../config/mongoCollections');
const { addPost } = require('./locations');

const getAll = async () => {
  let postCol = await posts();
  let all = await postCol.find({}).toArray();
  return all.map(x => idToStr(x));
}
const getPostById = async (id) => {
  try {
    let parsedId = checkId(id);
    let postCol = await posts();
    const post = await postCol.findOne({ _id: parsedId });
    if (post === null) throw Error('No post with that id');
    return post;
  } catch (e) {
    console.log(`Get post by id failed: ${e}`);
    return { error: e };
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
    return { error: e };
  }

  

  const postCol = await posts();
  const { insertedId } = await postCol.insertOne(newObj);
  if (!insertedId) throw Error("Failed to create post");
  newObj._id = insertedId.toString();

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
      ...checkComment(args, true)
    };
  } catch (e) {
    console.log(`Creating comment failed: ${e}`);
    return { error: e };
  }
  const postCol = await posts();
  const updateInfo = await postCol.updateOne(
    { _id: parsedId },
    { $addToSet: { comments: commentObj } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw Error("Failed to add comment");
  return await getPostById(args.postId);
}
module.exports = {
  getAll,
  create,
  addComment,
  getPostById
  // getByPosterName
}