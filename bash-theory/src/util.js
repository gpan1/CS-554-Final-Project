const ObjectId = require('mongodb').ObjectId

const validateStr = (str) => str && typeof str === 'string'
<<<<<<< HEAD
  && str.replaceAll(/ +/g, '').length !== 0;

// validates location object for creation
=======
    && str.replaceAll(/ +/g, '').length !== 0;
const validateNum = (num) => num && typeof num === 'number'
    && num >= 0 && num <= 5;
// dummy function for validating locations once google maps api is added
>>>>>>> 23f298c3915f0bfcae991943fce7e871d81b50e2
const validateLocation = (location) => {
  if (!validateStr(location.name)
    || !validateStr(location.description)
    || !validateCoordinates(location.location))
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
    // invalid dates produce NaN when getTime() is called
    // NaN is never equal to itself
    || (date.getTime() !== date.getTime()))
    return false;
  return true;
}
let checkComment = (args) => {
<<<<<<< HEAD
  if (!args)
    throw TypeError("No args supplied");
  if (!validateStr(args.name)
    || !validateStr(args.body))
    throw TypeError(`Invalid or missing fields in comment: ${JSON.stringify(args)}`);
  const newObj = {
    _id: ObjectId(),
    name: args.name,
    body: args.body
  };
  return newObj;
=======
    if (!args)
        throw TypeError("No args supplied");
    if (!validateStr(args.posterName)
        || !validateStr(args.content)
        || !validateNum(args.rating)
        || !validateDate(args.date))
        throw TypeError(`Invalid or missing fields in comment: ${JSON.stringify(args)}`);
    const newObj = {
        // _id: ObjectId(),
        posterName: args.posterName,
        content: args.content,
        date: args.date,
        rating: args.rating
    };
    return newObj;
>>>>>>> 23f298c3915f0bfcae991943fce7e871d81b50e2
}
let checkPost = (args) => {
  if (!args)
    throw TypeError("No args supplied");

  // required fields
  if (!validateStr(args.posterName)
    || !validateStr(args.title)
    || !validateStr(args.content)
    || !validateDate(args.date)
    || !validateCoordinates(args.location)
    // optional fields, checking only if passed
    || (args.imgUrl && !validateStr(args.imgUrl))
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
    location: args.location
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
  if (obj.posts)
    obj.posts = obj.posts.map(x => x.toString())
  return obj;
}

module.exports = {
  validateStr,
  validateLocation,
  validateCoordinates,
  validateDate,
  checkId,
  checkPost,
  idToStr,
  checkComment
}