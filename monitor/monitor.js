// require all dependencies
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

var watchFor = "fyi the last panda died";

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

// check every x minutes
var checkIntervalMin = 30;
var checkInterval = 1000 * 60 * checkIntervalMin;

//////////////////////
// web scraping
//////////////////////

var binPath = phantomjs.path
var childArgs = [path.join(__dirname, phantomFile)]

function checkStats() {
	console.log("checking stats...");

	// scrape webpage
	childProcess.execFile(binPath, childArgs, function(err, newStr, stderr) {
	  if (stderr) {
	  	console.log(stderr);      // Always empty
	 	}
	 	if (newStr) {
	 		processJSON(newStr);
	 	}
	})		
}

checkStats();

setInterval(function() {
	checkStats();
}, checkInterval);

// parse and act on data
function processJSON(newStr) {
	var newJSON = JSON.parse(newStr);
	// console.log(newJSON); // print all data

	// fake
	// newJSON[animal] = 0;

	console.log(animal + "'s left: " + newJSON[animal]);

	// if there are none of the animal left
	if (newJSON[animal] == 0) {
		console.log("all dead :(");
		post();
	}
	else {
		console.log("some still alive!");
	}
}

//////////////////////
// listen to Twitter
//////////////////////

console.log("watching " + watchFor);

// set up a stream
var streamer = client.stream('statuses/filter', {track: watchFor});

streamer.on('data', function(tweet) {
    if (tweet.user != null) {
        var name = tweet.user.screen_name;
        var text = tweet.text;
        var date = moment(tweet.created_at, "ddd MMM DD HH:mm:ss Z YYYY");

        console.log(">    @" + name + " said: " + text + ", on " + date.format("YYYY-MM-DD") + " at " + date.format("h:mma"));
    }

    post();
});

//////////////////////
// post on Twitter
//////////////////////

function post() {
	
	// post a tweet
	client.post('statuses/update', {

	    status: "The last panda just passed away at " + moment().format("dddd, MMMM Do, YYYY, h:mm:ss a") + "! #lastpanda #mti"

	    }, function(err, tweet, res) {
	    if (!err) {
	            console.log("You tweeted: " + tweet.text);
	    } else {
	            console.log(err);
	    }
	});
}
