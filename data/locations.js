const {
  validateLocation,
  checkId,
  validateCoordinates,
  validateStr,
  idToStr,
  validateArray,
} = require("../util");
const { locations } = require("../config/mongoCollections");
const { posts } = require("../config/mongoCollections");

const bluebird = require('bluebird')
const redis = require("redis");
const client = redis.createClient({url: "redis://:p22144c42162cd2196ff3e96b3b483b28136b2ccc4e0c3465a98af31c28f79221@ec2-52-202-231-11.compute-1.amazonaws.com:21959"});
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
};
const updateRating = async (id) => {
  try {
    const loc = await getLocById(id);
    const postList = loc.posts;
    let acc = 0;
    let cnt = 0;
    const postCol = await posts();
    for (let pid of postList) {
      const post = await postCol.findOne({ _id: checkId(pid) });
      acc += post.rating;
      cnt++;
    }
    acc = acc / cnt;
    const locCol = await locations();
    const parsedId = checkId(id);
    const result = await locCol.updateOne(
      { _id: parsedId },
      { $set: { avgRating: acc } }
    );
    if (result.modifiedCount === 0 && result.matchedCount === 0)
      throw Error("Document not found");
    return result;
  } catch (e) {
    throw Error("Failed to update location average rating: " + e);
  }
};
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
      { returnNewDocument: true }
    );
    if (!updateResult) throw Error("Failed to add post to location");
    updateRating(locationId);
    return updateResult;
  } catch (e) {
    throw Error("Failed to add post to location: " + e);
  }
};

const create = async (args) => {
  if (!args || !validateLocation(args)) 
    throw TypeError("Invalid location");

  let newObj = {
    name: args.name,
    location: args.location,
    description: args.description,
    avgRating: "N/A",
    tags: [],
    posts: [],
  };
  if (args.tags) {
    newObj.tags = args.tags;
  }
  const locCol = await locations();
  const { insertedId } = await locCol.insertOne(newObj);
  if (!insertedId) throw Error("Failed to create location");
  await client.zaddAsync("popular_locations", 1, insertedId.toString());
  return idToStr(newObj);
};
/**
 * Checks if the location id is valid and returns with the location object if it exists
 * @param {string}
 * @return {object}
 */
const getLocById = async (id) => {
  try {
    let parsedId = checkId(id);
    let locCol = await locations();
    const loc = await locCol.findOne({ _id: parsedId });
    if (loc === null) throw Error("No loc with that id");
    await client.zincrbyAsync('popular_locations', 1, id);
    return idToStr(loc);
  } catch (e) {
    return { error: e };
  }
};

const getPopularLocations = async () => {
  try {
    let popularCache = 
      await client.zrangebyscoreAsync("popular_locations", 0, "inf");
    if (popularCache.length === 0) 
      throw Error("No locations available");
    let popularArr = popularCache.reverse();
    if (popularArr.length > 20) 
      popularArr = popularArr.slice(0, 20);
    return popularArr;
  } catch (e) {
    console.log(`Get popular locations failed: ${e}`);
    return {error: e}
  }
};

/**
 * Given a list of one or more tags, returns all locations that match the tags
 * Note: this attempts to match ALL given tags; if a post doesn't have ALL
 * the supplied tags, it will not be included in the result
 * @param {[string]} tags
 * @returns All posts matching the tags
 * @throws TypeError on invalid input
 */
const getLocsByTags = async (tags) => {
  if (!Array.isArray(tags))
    throw TypeError(`Expected array, got ${tags ? tags : "nothing"}`);

  // validate every tag
  if (!validateArray(tags, validateStr))
    throw TypeError("getPostsByTags: not all tags passed string check");

  const locCol = await locations();
  try {
    const matches = await locCol
      .find({
        tags: {
          $all: tags,
        },
      })
      .toArray();
    return matches.map((x) => idToStr(x));
  } catch (e) {
    console.log(`getLocsByTags encountered error: ${e}`);
    return null;
  }
};

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
      throw TypeError(
        `location update invalid description: ${args.description}`
      );
    updateObj.description = args.description;
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
    const result = await locationCol.updateOne(
      { _id: parsedId },
      { $set: updateObj }
    );

    const updated = await locationCol.findOne({ _id: parsedId });

    // if (result.modifiedCount === 0)
    //   throw Error("Document not found");

    return idToStr(updated);
  } catch (e) {
    console.log("Location update error:");
    console.log(e);
  }
};

/**
 * Removes location with given ID, if found
 * @param {string} location id
 * @returns {boolean} whether or not a location was deleted
 */
const remove = async (id) => {
  if (!validateStr(id)) throw TypeError("location remove invalid id");

  const parsedId = checkId(id);
  const locationCol = await locations();

  try {
    const result = await locationCol.deleteOne({ _id: parsedId });
    if (result.deletedCount === 0) return false;
    return true;
  } catch (e) {
    console.error(`location remove encountered error: ${JSON.stringify(e)}`);
    return false;
  }
};
/**
 * Takes in an object that must contain term to search for.
 * Optional fields include tags in the form of an array, ie:['Building', 'Class'],
 * and sorting options in the form of [sortingField, sortingOrder].
 * SortingOrder: 1 is ascending, -1 is descending
 * @param {object}
 * @return {Array} array of posts matching search
 */
const locSearch = async (args) => {
  let res = [];
  let tags = ["Building", "Class", "Eating Spot", "Professor"];
  let sorting = { name: 1 };
  const validFields = ["name", "avgRating"];
  try {
    if (!validateStr(args.term)) throw TypeError(`Invalid term: ${args.term}`);
    if (args.tags) {
      for (let t of args.tags) {
        if (!validateStr(t)) throw TypeError(`Invalid tag: ${t}`);
      }
      tags = args.tags;
    }
    // if sorting is provided it will be in the form [field, order]
    // for order: 1 is ascending, -1 is descending
    if (args.sort) {
      if (!Array.isArray(args.sort))
        throw TypeError(`Invalid sort: ${args.sort}`);
      if (!validateStr(args.sort[0]))
        throw TypeError(`Invalid sort field: ${args.sort[0]}`);
      if (!validFields.includes(args.sort[0]))
        throw TypeError(`Invalid sort field: ${args.sort[0]}`);
      let order = 1;
      if (args.sort.length > 1) {
        // if the sort option is invalid, just use default of 1
        if (typeof args.sort[1] === "number" && args.sort[1] === -1) {
          order = -1;
        }
      }
      sorting = {};
      sorting[`${args.sort[0]}`] = order;
    }
    const locCol = await locations();
    const query = {
      name: { $regex: `${args.term}` },
      tags: { $in: tags },
    };
    const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: sorting,
      // projection: { _id: 0, title: 1, imdb: 1 },
    };

    const location = await locCol.find(query, options);
    if (location === null) throw Error("No location match");
    await location.forEach((x) => {
      res.push(idToStr(x));
    });

    console.log("search result: ", res);

    // await post.forEach(console.log);
    return res;
  } catch (e) {
    console.log(`Location search error:`);
    console.log(e);
    return { error: e };
  }
};

module.exports = {
  getAll,
  create,
  addPost,
  update,
  remove,
  getPopularLocations,
  // getByCoords,
  getLocById,
  locSearch,
  updateRating,
  getLocsByTags,
  // getById,
  // getByPosterName
};
