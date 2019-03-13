// Key functions for validating Chinese ID card number
const errorDict = {0: '1', 1: '0', 2: 'X', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3',10: '2'};
const numSeq = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

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

//Convert an old 15 digit Chinese National ID card number to a modern 18 digit number
function upgrade(idNumber) {
    upgraded = idNumber.substr(0,6) + '19' + idNumber.substr(6);
    upgraded += checkSum(upgraded);
    return upgraded;
};

module.exports.isValid = isValid;
module.exports.upgrade =  upgrade;