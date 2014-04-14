// Init reqs
/* jslint node: true */
'use strict';

var mUtilex = require('utilex'),
    mIP2CO  = require('../')
;

// Init vars
var gConfig = {isHeapdump: false},
    gArgs   = mUtilex.tidyArgs()
;

// Check args
if(typeof gArgs['heapdump'] !== 'undefined') gConfig.isHeapdump = true;

// heapdump
if(gConfig.isHeapdump === true) var mHeapdump = require('heapdump');

// Tests
console.log('test-http.js');

// Loads the database and listen http requests.
function loadAndServe() {
  mIP2CO.dbLoad();
  mIP2CO.listenHTTP({hostname: 'localhost', 'port': 12080});
}

if(mIP2CO.dbCSVCheckExp(48)) {
  mIP2CO.dbGet().then(function() {
    loadAndServe();
  }, function(err) {
    console.log(err);
  });
} else {
  loadAndServe();
}

// heapdump
if(gConfig.isHeapdump === true) mHeapdump.writeSnapshot(__dirname + '/dump-' + Date.now() + '.heapsnapshot');