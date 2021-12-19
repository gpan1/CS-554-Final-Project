const { validateLocation, checkId, validateCoordinates,
   validateStr, idToStr, validateArr } = require('../util')
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
const addPost = async (locationId, postId) => {
  // if (!validateLocation(location)) throw TypeError("Invalid location");
  if (!postId) throw TypeError("No post id given");
  //check if location exists in database
  await getLocById(locationId);
  const locs = await locations();

  try {
    let _postId = checkId(postId);
    let _locId = checkId(locationId);
    const updateResult = locs.findOneAndUpdate(
      // { location },
      { _id: _locId },
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
/**
* Checks if the post id is valid and returns with the post if it exists
* Also increments the redis post count for popular posts as someone has visited the post
* @param {string}
* @return {object}
*/
const getLocById = async (id) => {
  try {
    let parsedId = checkId(id);
    let locCol = await locations();
    const loc = await locCol.findOne({ _id: parsedId });
    if (loc === null) throw Error('No loc with that id');
    //   await client.zincrbyAsync('popular', 1, id);
    return idToStr(loc);
  } catch (e) {
    console.log(`Get location by id failed: ${e}`);
    return { error: e };
  }
}

const getByCoords = (coords) => {
  if (!validateCoordinates(coords))
    throw TypeError("Invalid coordinates; expected [longitude, latitude]");
  // todo ???

}

/**
 * Updates a location.
 * 
 * Cannot change the posts associated with it.
 * @param {string} id 
 * @param {object} args 
 * @returns {object} updated result
 */
const update = async (id, args) => {
  let parsedId = checkId(id);
  if (!args || JSON.stringify(args) === "{}")
    throw TypeError(`location update expected args, got nothing`);

  const updateObj = {};

  if (args.name) {
    if (!validateStr(args.name))
      throw TypeError(`location update invalid name: ${args.name}`);
    updateObj.name = args.name;
  }

  if (args.description) {
    if (!validateStr(args.description))
      throw TypeError(`location update invalid description: ${args.description}`);
    updateObj.name = args.description;
  }

  if (args.tags) {
    if (!validateArray(args.tags, validateStr))
      throw TypeError(`location update invalid name: ${args.name}`);
    updateObj.tags = args.tags;
  }

  if (args.location) {
    if (!validateCoordinates(args.location))
      throw TypeError(`location update invalid name: ${args.name}`);
    updateObj.location = args.location;
  }

  const locationCol = await locations();
  try {
    const result = await locationCol.findOneAndUpdate(
      { _id: parsedId },
      { $set: updateObj },
      { returnOriginal: false });
    if (!result.value)
      throw Error("Document not found");
    return idToStr(result.value);
  } catch (e) {
    console.log('location update encountered error: ', JSON.stringify(e));
  }
}

/**
 * Removes location with given ID, if found
 * @param {string} location id 
 * @returns {boolean} whether or not a location was deleted
 */
const remove = async (id) => {
  if (!validateStr(id))
    throw TypeError('location remove invalid id');

  const parsedId = checkId(id);
  const locationCol = await locations();

  try {
    const result = await locationCol.deleteOne({ _id: parsedId });
    if (result.deletedCount === 0)
      return false;
    return true;
  } catch (e) {
    console.error(`location remove encountered error: ${JSON.stringify(e)}`);
    return false;
  }
}

module.exports = {
  getAll,
  create,
  addPost,
  update,
  remove,
  // getByCoords,
  getLocById
  // getById,
  // getByPosterName
}
