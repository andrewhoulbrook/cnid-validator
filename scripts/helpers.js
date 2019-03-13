// Extract card holder's basic information from ID number
let geo = require('./adminGeo.js');

function getGender(idNumber) {
    const genderDict = {1: ['男', 'Male'], 0: ['女', 'Female']};
    return genderDict[(parseInt(idNumber.substr(-2))) % 2];
}

function getDOB(idNumber) {
    birthYear = idNumber.substr(6,4);
    birthMonth = idNumber.substr(10,2);
    birthDay = idNumber.substr(12,2);
    return { birthYear : birthYear, birthMonth : birthMonth, birthDay : birthDay};
}

function getAge(dob) {
    today = new Date();
    return today.getFullYear() - parseInt(dob['birthYear']);    
}

function getAdminGeo1(idNumber) {
    return geo.adminGeo[idNumber.substr(0,2) + '0000'];
}

function getAdminGeo2(idNumber) {
    return geo.adminGeo[idNumber.substr(0,4) + '00'];
}

function getAdminGeo3(idNumber) {
    return geo.adminGeo[idNumber.substr(0,6)];
}

module.exports.getGender = getGender;
module.exports.getDOB = getDOB;
module.exports.getAge = getAge;
module.exports.getAdminGeo1 = getAdminGeo1;
module.exports.getAdminGeo2 = getAdminGeo2;
module.exports.getAdminGeo3 = getAdminGeo3;