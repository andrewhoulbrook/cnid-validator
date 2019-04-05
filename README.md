# Verifying Chinese National Identity Numbers

Verify the integrity of a Chinese National ID (身份证) number and extract various pieces of information about the card holder from the ID number.

This was toy project to teach myself the structure of Chinese ID card numbers and how they work. The scripts in this repo perform the following functions:

- Verify the integrity of a given Chinese ID number (using a MOD 11-2 checksum)
- Extract information about the card holder (i.e. DoB, gender and geographic location where card was issued)
- The extract information in translated into English and Pinyin

The scripts contained in this repo may also be useful for anyone with a similar interest. They may also be useful for anyone handling and processing Chinese ID numbers and could be integrated into online integrity and counter-fraud processes.     

## Background - History of the National ID Card

A (mainland) Chinese ID card,  is formally known as a 'Resident Identity Card' (居民身份证), issued as mandatory to all Chinese citizens over 16 years of age. It is a uniform legal document used to certify the identity of the holder.  

China's first-generation ID card typically bore a 15-digit ID number, issued by local authorities. They were easy to counterfeit and lacked a national tracking number to assist with fraud detection. After 2013, the second-generation ID card is reported to have all but replaced its predecessor. 

## Background - V2 ID Cards

All second-generation ID cards feature a 18-digit ID number. Each second-generation ID card must, by law, contain the following uniform information shown below.

<p align="center">
  <img src="/doc/ID_Card.png">
</p>

China's 18-digit ID number breaks down as shown below. 

<p align="center">
  <img src="/doc/ID_NumString.png">
</p>

The first series of digits correspond to China's administrative geography. Digits 7 through to 14 are the card holder's date of birth (formatted YYYYMMDD). Remaining digits help disambiguate individuals with the same location and date of birth. 

Finally the eighteenth digit is a validity checking code and is generated according to the ISO 7064:1983 (MOD 11-2) checksum algorithm. 

## Online Card Validators

There are many online ID card validators that do exactly what i've done here. Many are also free to use. However, there's been multiple times when I used such free services to test 18-digit ID numbers (which I know through other channels are genuine and valid) which fail to validate. This is often due to changes in China's administrative geography and the fact that such online validator services tend not to perform lookups against those older and now defunct geographic area codes.

## Getting Started

### Prerequisites

The validation and data extraction scripts are written in JavaScript. The scripts intended to be run server-side in Node.js. This is a first attempt for me at experimenting with Express and Node.js. 

The following npm packages are used (mainly for curiosity and for me to experiment with):

```
require('express-validator/check')   // User input validation
require('express-validator/filter')  // Sanitizing user input
require('helmet')
```

A basic ```pug``` template is used to generate the HTML input page.

In the repo is also a JSON array named ```adminGeo.js``` which is a large array attempting to map China's administrative geographic unit codes to their administrative names (pre-translated into English and Pinyin). 
I've complied a full list of the current administrative geographic units from the [National Statistics Website](https://stats.gov.cn) and combined as many of the historical ones as I could possibly find. *Disclaimer: I can't guarantee to have found them all.*

### Installing

You'll need [Node.js]( https://nodejs.org) installed with the following dependencies with my ```package.json``` looking as follows:

```
"dependencies":  { 
	"express" : "^4.16.4"
 	"express-validator" : "^5.3.1"
	"pug" : "^2.0.3"
}
```

These can easily be installed from npm as show below:  

```
npm install express
npm install express-validator
npm install helmet
npn install pug
```

### Running the App

The Node server listens of port 4001 rendering the following skeleton HTML page for user input.

<p align="center">
  <img src="/doc/form.png">
</p>

The results of validating a given ID number and extracting the basic card holder information is returned as a JSON array. 

Here's an example output from the ID number used in the sample images show above (it's fictional number so doesn't validate):

```
{
   "id": "110102197810272321",
   "validation": "INVALID",
   "gender": {
      "chinese": "女",
      "english": "Female"
   },
   "dob": {
      "birthYear": "1978",
      "birthMonth": "10",
      "birthDay": "27"
   },
   "age": 41,
   "adminGeo1": {
      "chinese": "北京市",
      "pinyin": "bei jing shi",
      "english": "Beijing"
   },
   "adminGeo2": {
      "chinese": "市辖区",
      "pinyin": "shi xia qu",
      "english": "Municipal districts"
   },
   "adminGeo3": {
      "chinese": "西城区",
      "pinyin": "xi cheng qu",
      "english": "Xicheng District"
   }
}
```

## Future Developments

* Explore adding error handling in Node.js and with the Express framework.
* Validation of ID numbers in bulk. 

## Built With

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Node.js](https://nodejs.org)
* [Express.js]( http://expressjs.com/)
* [Pug Templating](https://pugjs.org/api/getting-started.html)

## Authors

* **Andrew Houlbrook** - *Initial work* - [andrewhoulbrook](https://github.com/andrewhoulbrook)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
