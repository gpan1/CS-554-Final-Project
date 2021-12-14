const ObjectId = require('mongodb').ObjectId

const validateStr = (str) => str && typeof str === 'string'
    && str.replaceAll(/ +/g, '').length !== 0;

// dummy function for validating locations once google maps api is added
const validateLocation = (location) => {
    if (!location 
        || typeof location !== 'object'
        || Array.isArray(location)
        || location.lat === null || typeof(location.lat) !== 'number'
        || location.lng === null || typeof(location.lng) !== 'number'){
            console.log(location.lat !== null,location.lng);
            return false;
        }
        
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
    if (!args)
        throw TypeError("No args supplied");
    if (!validateStr(args.name)
        || !validateStr(args.body))
        throw TypeError(`Invalid or missing fields in comment: ${JSON.stringify(args)}`);
    const newObj = {
        name: args.posterName,
        body: args.body
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
        || !validateLocation(args.location)
    // optional fields, checking only if passed
        || (args.imgUrl && !validateStr(args.imgUrl))
        || (args.tags && args.tags.reduce( (x, acc) => 
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
        obj.posts = obj.posts.map( x => x.toString())
    return obj;
}

module.exports = {
    validateStr,
    validateLocation,
    validateDate,
    checkId,
    checkPost,
    idToStr,
    checkComment
}