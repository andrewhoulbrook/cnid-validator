// Key functions for validating Chinese ID card number
const errorDict = {0: '1', 1: '0', 2: 'X', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3',10: '2'};
const numSeq = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const genderDict = {1: ['男', 'Male'], 0: ['女', 'Female']};

// Require array of Chinese administrative geographic region code and their names
let geo = require('./data/adminGeo.js');

// Perform GB 11643-1999 checksum (ISO 7064:1983)
function checkSum(idNumber) {
    let dataDigits = (idNumber.substr(0,17)).split("");
    let checkDigit = (numSeq.map(function (element, index) {
        return element * dataDigits[index];
    }).reduce((x, y) => x + y, 0) % 11);
    return errorDict[checkDigit];
};

// Verify checksum with check digit in a Chinese ID number
function isValid(idNumber) {
    if (checkSum(idNumber) === idNumber.substr(-1)) {
        return "VALID";
    } else {
        return "INVALID";
    }
};

// Convert an old 15 digit Chinese National ID card number to a modern 18 digit number
function upgrade(idNumber) {
    upgraded = idNumber.substr(0,6) + '19' + idNumber.substr(6);
    upgraded += checkSum(upgraded);
    return upgraded;
};

// Create a Chinese National ID Card Number object and attributes
// Extract the following card holder information:
// Gender, Date of Birth, Age (in years), Administrative geographic region where card was first registered and issued 
function makeCNID (idNumber) {
    cnid = {};
    cnid.id = idNumber;
    cnid.gender = genderDict[(parseInt(idNumber.substr(-2))) % 2]; // Odd numbers = Male, Even numbers = Female
    cnid.dob = { birthYear : idNumber.substr(6,4), birthMonth : idNumber.substr(10,2), birthDay : idNumber.substr(12,2) };
    today = new Date();
    cnid.age = today.getFullYear() - parseInt(cnid.dob['birthYear']);
    cnid.adminGeo1 = geo.adminGeo[idNumber.substr(0,2) + '0000']; // E.g. Province, Municpality, Autonomous or Special Administrative Regions
    cnid.adminGeo2 = geo.adminGeo[idNumber.substr(0,4) + '00'];   // E.g. City or District 
    cnid.adminGeo3 = geo.adminGeo[idNumber.substr(0,6)];          // E.g. Town, Village, Sub-district
    return cnid;
}

// Module exports
module.exports.isValid = isValid;
module.exports.upgrade = upgrade;
module.exports.makeCNID = makeCNID;