// require all dependencies
var fs = require('fs');
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')

var Twitter = require('twitter'); // for the Twitter API
var env = require('dotenv').config(); // for loading API credentials
var moment = require('moment'); // for displaying dates nicely

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//////////////////////
// variables
//////////////////////

var phantomFile = 'scraper-phantom.js';

/*
select one of the following animals:
* TigerPopulation
* SouthChinaTiger
* AmurTiger
* BengalTiger
* AmurLeopard
* MountainGorilla
* Sumatranorangutan
* GiantPanda
* AsianElephant
* SumatranElephant
* BlackRhino
* JavanRhino
* HawksbillTurtlenestingfemales
* LeatherbackTurtlenestingfemales
* BlueWhale
* Baiji
* Vaquita
* YangtzeFinlessPorpoise
*/
var animal = "GiantPanda"

console.log("let's go!");

//////////////////////
// web scraping
//////////////////////

var binPath = phantomjs.path
var childArgs = [path.join(__dirname, phantomFile)]

// scrape webpage
childProcess.execFile(binPath, childArgs, function(err, newStr, stderr) {
  if (stderr) {
  	console.log(stderr);      // Always empty
 	}
 	if (newStr) {
 		writeFiles(newStr);
 	}
})

// save data
function writeFiles(newStr) {
	// rename old JSON file
  fs.readFile('json-newest.js', 'utf8', (err, prevStr) => {
  	if (!err) {
	  	fs.writeFile('json-previous.js', prevStr, 'utf8', function(err) {
			  if(err) {
			  	return console.log(err);
				}
			  
			  console.log("old file renamed!");

			  writeNewFile(newStr);

			  processJSON(newStr, prevStr);
			});
		}
		else {
			console.log("previous data not found.");
			writeNewFile(newStr);
			console.log("will try again next cycle.");
		}
	});
}

function writeNewFile(newStr) {
	// save JSON to file
  fs.writeFile("json-newest.js", newStr, 'utf8', function(err) {
	  if(err) {
	  	return console.log(err);
		}
	  
	  console.log("new file saved!");
	});
}

// parse and act on data
function processJSON(newStr, prevStr) {
	var newJSON = JSON.parse(newStr);
	console.log(newJSON);
  console.log("myAnimal: " + newJSON[animal]);
	if (prevStr.length) {
		var prevJSON = JSON.parse(prevStr);
	}

	// if an animal has died
	if (newJSON[animal] > prevJSON[animal]) {
		post();
	}
	else {
		console.log("still alive!");
	}
}

//////////////////////
// post on Twitter
//////////////////////

function post() {
	
	// post a tweet
	client.post('statuses/update', {

	    status: "The last panda just passed away at " + moment().format("dddd, MMMM Do, YYYY, h:mm:ss a") + "! #lastpanda"

	    }, function(err, tweet, res) {
	    if (!err) {
	            console.log("You tweeted: " + tweet.text);
	    } else {
	            console.log(err);
	    }
	});
}
