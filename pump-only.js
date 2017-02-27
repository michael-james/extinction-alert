/*
Last Panda Alarm
*/

var GPIO = require('onoff').Gpio; // for GPIO pin control

//////////////////////
// variables
//////////////////////

// GPIO
var pump = new GPIO(12, 'out');
// we are looking for both the press and release of the button, so use 'both' edges
// var button = new GPIO(27, 'in', 'both');

// duration the pump is on in milliseconds
var pumpOn = 5000;

//////////////////////
// hardware
//////////////////////

// hardware ritual
function startRitual() {
	console.log("** glitter **");
	flash(pump);
}

// flash an LED
function flash(PINid) {
    PINid.writeSync(1);

    setTimeout(function() {
            PINid.writeSync(0);
        }, pumpOn);
}

// watch the button for changes
// button.watch(function(err, val) {
// 	startRitual();
// });

// gracefully shut down the pins on quit
process.on('SIGINT', function() {
        // button.unexport();
        pump.unexport();
})

startRitual();