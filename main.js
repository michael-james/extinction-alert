/*
NodeJS + PhantomJS architecture based on phantomjs-prebuilt package example
*/


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

//////////////////////

var fs = require('fs');
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
var binPath = phantomjs.path
var childArgs = [path.join(__dirname, phantomFile)]

// scrape webpage
childProcess.execFile(binPath, childArgs, function(err, newStr, stderr) {
  if (stderr) {
  	console.log(stderr);      // Always empty
 	}
  writeFiles(newStr);
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

			  // save JSON to file
			  fs.writeFile("json-newest.js", newStr, 'utf8', function(err) {
				  if(err) {
				  	return console.log(err);
					}
				  
				  console.log("new file saved!");
				});

			  processJSON(newStr, prevStr);
			});
		}
		else {
			console.log("history not find.")
		}
	});
}

// parse and act on data
function processJSON(newStr, prevStr) {
	var newJSON = JSON.parse(newStr);
	console.log(newJSON);
  console.log("myAnimal: " + newJSON[animal]);
	var prevJSON = JSON.parse(prevStr);

	// if an animal has died
	if (newJSON[animal] > prevJSON[animal]) {
		startRitual();
	}
	else {
		console.log("still alive!")
	}
}

// hardware ritual
function startRitual() {
	console.log("** glitter **");
}




