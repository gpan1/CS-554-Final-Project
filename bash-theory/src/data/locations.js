const { validateLocation, checkId, validateCoordinates, validateStr, idToStr } = require('../util')
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
const addPost = async (location, postId) => {
  if (!validateLocation(location)) throw TypeError("Invalid location");
  if (!postId) throw TypeError("No post id given");

  const locs = await locations();

  try {
    let _postId = checkId(postId);
    const updateResult = locs.findOneAndUpdate(
      { location },
      { $push: { posts: _postId } },
      { returnNewDocument: true });
    if (!updateResult) throw Error("Failed to add post to location");
    return updateResult;
  } catch (e) {
    throw Error("Failed to add post to location: " + e);
  };
}

const create = async (args) => {
  if (!args
    || !validateLocation(args))
    throw TypeError("Invalid location");

  let newObj = {
      ...args,
      posts: []
    };
  const locCol = await locations();

  const { insertedId } = await locCol.insertOne(newObj);
    
  if (!insertedId) throw Error("Failed to create location");

  return idToStr(newObj);
}

const getByCoords = (coords) => {
  if (!validateCoordinates(coords)) 
    throw TypeError("Invalid coordinates; expected [longitude, latitude]");
  // todo

}

module.exports = {
  getAll,
  create,
  addPost,
  getByCoords
  // getById,
  // getByPosterName
}
