const ObjectID = require('mongodb').ObjectID
const validateStr = (str) => str && typeof str === 'string'
    && str.replaceAll(/ +/g, '').length === 0;

// dummy function for validating locations once google maps api is added
const validateLocation = (location) => true;

/**
 * Haha
 * @param {string} date 
 * @returns {boolean} whether or not it's valid
*/
let validateDate = (date) => { 
    let re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,4}$/;
    if (typeof date !== 'string' 
        || invalidString(date)
        || date.match(re) == null)
        return false;

    let [month, day, year] = date.split('/').map(x => +x);

    let daysInMonth;

    // determine expected number of days in the month
    // stolen from https://gomakethings.com/how-to-check-if-a-date-is-valid-with-vanilla-javascript/
    switch (month - 1) {
        case 1:
            daysInMonth = 
                // check for leap year
                (year % 4 == 0 && year % 100) || year % 400 == 0 
                ? 29
                : 28;
            break;
        case 3: case 5: case 8: case 10:
            daysInMonth = 30;
            break;
        default:
            daysInMonth = 31;
    }

    if (day < 0 
        || day > daysInMonth
        || month < 1 
        || month > 12)
        return false;
    return true;
}

/**
* Given a string representation of an ID,
* checks for presence, type, and validity
* @param {string} id 
* @return {ObjectID} processed ObjectID
*/
let checkId = (id) => {
    if (invalidString(id))
        throw TypeError(`Invalid id: ${id}`);
    let _id;
    _id = ObjectID(id);    
    if (!ObjectID.isValid(_id))
        throw Error(`Invalid ObjectID: ${_id}`);
    return _id;
}
let checkPost = (args) => {
    if (!args)
        throw TypeError("No args supplied");

    // required fields
    if (!validateStr(args.posterName)
        || !validateStr(args.title)
        || !validateStr(args.content)
        // || !validateDate(args.date)
        // optional fields, checking only if passed
        || (args.imgUrl && !validateStr(args.imgUrl))
        || (args.location && !validateLocation(args.location))
        || (args.tags && args.tags.reduce( (x, acc) => 
            (acc && validateStr(x)), true)))
        throw TypeError("Invalid or missing fields in post");

    // reconstruct object to omit any extra fields potentially supplied
    const newObj = {
        posterName: args.posterName,
        title: args.title,
        content: args.content,
        date: args.date
    };

    if (args.imgUrl) newObj.imgUrl = args.imgUrl;
    if (args.location) newObj.location = args.location;
    if (args.tags) newObj.tags = args.tags;
    
    return newObj;
}
/**
* silly function for turning ObjectIDs to strings in an object
* @param {object} result 
* @returns {object} stringified id object
*/
let idToStr = (post) => {
    post._id = post._id.toString();
    return result;
}

module.exports = {
    validateStr,
    validateLocation,
    validateDate,
    checkId,
    checkPost,
    idToStr
}