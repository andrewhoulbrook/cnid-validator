// Simple Node.js app written using the Express framework and Pug template

// Basic Node server boilerplate and requires for Express, Hemlet and Express-Validator input sanitization modules
const path = require('path');
const express = require('express');
const app = express();
const helmet = require('helmet');
const { check } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');

// Import scripts handling validation and extraction of card holder information
let utils = require('./scripts/utils');

// Set views and urlencoded
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended : true}));
app.use(helmet());

// Set port number
const port = 4001;

// HTTP GET route handler 
app.get('/', (req, res) => {
    res.render('idcard');
});

// HTTP POST route handler. User inputs a Chinese ID card number.
app.post('/', [
    // Sanitize the user's input
    sanitizeQuery('idInput').trim().escape(),
    check('idInput').isLength({ max: 18 }.isNumeric())
    ], (req, res) => {
        let idString; idString = req.body.idInput;
        let idNumber;
        let validationMsg;

        // Set result header
        res.setHeader('Content-Type', 'application/json');

        if (idString.length == 15) {
            // If a older 15 digit ID number entered, convert to new 18 digit format
            let upgraded = utils.upgrade(idString);

            // Extract card holder info into idNumber object.
            idNumber = utils.makeCNID(upgraded);
            validationMsg = 'N\/A - CONVERTED TO 18-Digit FORMAT';
        } else {
            // Extract card holder info into idNumber object and validate 18 digit ID number
            idNumber = utils.makeCNID(idString);
            validationMsg = utils.isValid(idNumber.id);
        }
        
        // Return validation result and card holder info as JSON array 
        res.end(JSON.stringify( { 
            id : idNumber.id, 
            validation : validationMsg,
            gender : {chinese : idNumber.gender[0], english : idNumber.gender[1]},
            dob : idNumber.dob,
            age : idNumber.age,
            adminGeo1 : {chinese: idNumber.adminGeo1[0], pinyin: idNumber.adminGeo1[1], english : idNumber.adminGeo1[2]},
            adminGeo2 : {chinese: idNumber.adminGeo2[0], pinyin: idNumber.adminGeo2[1], english : idNumber.adminGeo2[2]},
            adminGeo3 : {chinese: idNumber.adminGeo3[0], pinyin: idNumber.adminGeo3[1], english : idNumber.adminGeo3[2]}
        }, null, 3));
});

// Add listener on chosen port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});