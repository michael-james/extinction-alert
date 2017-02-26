/*
Based on PhantomJS example phantomwebintro
*/

// Read animal extinction stats using PhantomJS, jQuery, and "includeJs"

"use strict";
var system = require('system');
var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// page to scrape
var site = "http://www.poodwaddle.com/worldclock/env5/";

page.open(site, function(status) {
    if (status === "success") {
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
            page.evaluate(function() {
                // scrape!
                jsonObj = {};

                // animal element
                var selector = ".WCs5";

                $(selector).each(function() {
                    // animal name (remove spc chars and whitespace)
                    var name = $(this).find(".WCsl").text().replace(/[^\w\s]/gi, '').replace(/\s/g,'');
                    // animal count (remove spc chars such as comma)
                    var count = $(this).find(".WCsv").text().replace(/[^\w\s]/gi, '');

                    // store data, with count as number
                    jsonObj[name] = eval(count);
                });

                // data to JSON, back to Node
                console.log(JSON.stringify(jsonObj));
            });
            phantom.exit(0);
        });
    } else {
        phantom.exit(1);
    }
});



