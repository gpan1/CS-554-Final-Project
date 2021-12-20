const ObjectId = require('mongodb').ObjectId

const validateStr = (str) => str && typeof str === 'string'
    && str.replaceAll(/ +/g, '').length !== 0;

/**
* Validates rating input, range from 0-5
*/
const validateNum = (num) => num && typeof num === 'number'
    && num >= 0 && num <= 5;

// https://stackoverflow.com/a/3809435
const urlRe = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

/**
 * Given a string, attempts to match a url reg-ex to it
 * Returns false if input is valid or no match is found
 * @param {string} url 
 * @returns {boolean | string}
 */
const validateUrl = url => {
  if (!url || !(typeof url === 'string'))
    return false;
  const urlMatch = url.match(urlRe);
  if (!urlMatch) return false;
  return urlMatch;
}

/** Confirms location object is valid before creating
 * @param {object} -- {name: String, description: String, location: [Number, Number]}
 * @returns {boolean}
 */
const validateLocation = (location) => {
  if (!validateStr(location.name)
    || !validateStr(location.description)
    || !validateCoordinates(location.location)) 
      return false;
    
  if (location.tags && !validateArray(location.tags, validateStr))
    return false;
    
  return true;
}

// validates coordinates [lng, lat]
const validateCoordinates = (coords) => {
  if (!coords)
    return false;
  if (!Array.isArray(coords))
    return false;
  if (coords.length !== 2)
    return false;
  const [lng, lat] = coords;
  if (typeof lng !== 'number'
    || typeof lat !== 'number')
    return false;

  if (lng < -180 || lng > 180) return false;
  if (lat < -90 || lat > 90) return false;

  return true;
};

/**
https://www.geeksforgeeks.org/how-to-check-a-date-is-valid-or-not-using-javascript/
*/
let validateDate = (date) => {
  if (!date
    || !date.getTime
    // invalid dates produce NaN when getTime() is called
    // NaN is never equal to itself
    || (date.getTime() !== date.getTime())
    ){
    return false;
    }
  return true;
}


let checkComment = (args) => {
    if (!args)
        throw TypeError("No args supplied");
    if (!validateStr(args.posterName)
        || !validateStr(args.content)
        || !validateDate(args.date))
        throw TypeError(`Invalid or missing fields in comment: ${JSON.stringify(args)}`);
    const newObj = {
        // _id: ObjectId(),
        posterName: args.posterName,
        content: args.content,
        date: args.date
    };
    return newObj;
}

let checkPost = (args) => {
  if (!args)
    throw TypeError("No args supplied");

  // required fields
  if (!validateStr(args.posterName)
    || !validateStr(args.title)
    || !validateStr(args.content)
    || !validateDate(args.date)
    || !validateStr(args.locationId)
    || !validateNum(args.rating)
    // optional fields, checking only if passed
    || (args.imgUrl && !validateUrl(args.imgUrl))
    || (args.tags && args.tags.reduce((x, acc) =>
      (acc && validateStr(x)), true))
  )
    throw TypeError(`Invalid or missing fields in post: ${JSON.stringify(args)}`);

  // reconstruct object to omit any extra fields potentially supplied
  const newObj = {
    posterName: args.posterName,
    title: args.title,
    content: args.content,
    date: args.date,
    locationId: args.locationId,
    location: args.location,
    rating: args.rating
  };

  if (args.imgUrl) newObj.imgUrl = args.imgUrl;
  if (args.tags) newObj.tags = args.tags;

  return newObj;
}

// --------- ID-related functions

/**
* Given a string representation of an ID,
* checks for presence, type, and validity
* @param {string} id 
* @return {ObjectId} processed ObjectID
*/
let checkId = (id) => {
  if (!validateStr(id))
    throw TypeError(`Invalid id: ${id}`);
  let _id;
  _id = ObjectId(id);
  if (!ObjectId.isValid(_id))
    throw Error(`Invalid ObjectID: ${_id}`);
  return _id;
}

/**
* silly function for turning ObjectIDs to strings in an object
* @param {object} result 
* @returns {object} stringified id object
*/
let idToStr = (obj) => {
  if (obj._id)
    obj._id = obj._id.toString();
  if (obj.locationId)
    obj.locationId = obj.locationId.toString();
  if (obj.posts)
    obj.posts = obj.posts.map(x => x.toString());
  if (obj.comments)
    obj.comments = obj.comments.map(x => idToStr(x));
  return obj;
}

/**
 * Reduces array according to validator function
 * 
 * False if error is encountered while applying validator
 * @param {[any]} arr 
 * @param {(any) => boolean} validatorFunc 
 * @returns {boolean} 
 */
const validateArray = (arr, validatorFunc) => {
  if (!arr || !Array.isArray(arr))
    return false;

  try {
    return arr.reduce( (acc, x) => acc && validatorFunc(x), true );
  } catch (e) {
    console.error(`validateArray encountered error: ${JSON.stringify(e)}`);
    return false;
  }
};

module.exports = {
  validateStr,
  validateLocation,
  validateCoordinates,
  validateDate,
  checkId,
  checkPost,
  idToStr,
  checkComment,
  validateArray,
  validateUrl,
  validateNum
}