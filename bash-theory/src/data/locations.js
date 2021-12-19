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
        {_id: _locId},
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
        name: args.name,
        location: args.location,
        description: args.description,
        tags: [],
        posts: []
        };
    if (args.tags){
        newObj.tags = args.tags;
    }
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
  // todo

}
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
    let tags = ['Building', 'Class', 'Eating Spot', 'Professor'];
    let sorting = { 'name': 1 };
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
            "name": { $regex: `${args.term}` },
            "tags": { $in: tags }    
        };
        const options = {
            // sort returned documents in ascending order by title (A->Z)
            sort: sorting
            // projection: { _id: 0, title: 1, imdb: 1 },
          };
        const post = await postCol.find(query);
        if (post === null) throw Error('No location match');
        await post.forEach((x)=>{
            res.push(idToStr(x));
        } );
        // await post.forEach(console.log);
        return res;
    } catch(e){
        console.log(`Location search failed: ${e}`);
        return {error: e};
    }
}

module.exports = {
  getAll,
  create,
  addPost,
  getByCoords,
  getLocById
  // getById,
  // getByPosterName
}
