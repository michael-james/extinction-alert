/*
Last Panda Alarm
*/

var Twitter = require('twitter'); // for the Twitter API
var env = require('dotenv').config(); // for loading API credentials
var moment = require('moment'); // for displaying dates nicely

if (GPIOon) {
    var GPIO = require('onoff').Gpio; // for GPIO pin control
}

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//////////////////////
// variables
//////////////////////

var GPIOon = false;

var watchFor = "#lastpanda";

// GPIO
if (GPIOon) {
    var pump = new GPIO(17, 'out');
}

// duration the pump is on in milliseconds
var pumpOn = 1000;

//////////////////////
// hardware
//////////////////////

if (GPIOon) {
    pump.writeSync(0);
}

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

    startRitual(pump);
});

// flash an LED
function startRitual(PINid) {
    console.log("starting ritual - pump on");
    if (GPIOon) {
        PINid.writeSync(1);
    }

    setTimeout(function() {
            console.log("ending ritual - pump off");
            if (GPIOon) {
                PINid.writeSync(0);
            }
        }, pumpOn);
}

// gracefully shut down the pins on quit
process.on('SIGINT', function() {
        // button.unexport();
        if (GPIOon) {
            pump.unexport();
        }
})