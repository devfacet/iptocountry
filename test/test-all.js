// Init reqs
/* jslint node: true */
'use strict';

var mUtilex = require('utilex'),
    mIP2CO  = require('../')
;

// Init vars
var gTestList = {
      MISC: true
    }
;

// Tests
console.log('test-all.js');

// Test for mics. features
if(gTestList.MISC === true) {
  console.log('dataDirCheck: ' + mIP2CO.dataDirCheck());
  console.log('dbFileCheck: ' + mIP2CO.dbFileCheck());
  console.log('dbFileCheck: ' + mIP2CO.dbFileCheck());
  console.log('dbCSVCheck: ' + mIP2CO.dbCSVCheck());

  if(!mIP2CO.dbCSVCheck()) {
    mIP2CO.dbGet().then(function() {
      console.log('dbGet: done!');
    }, function(err) {
      console.log('dbGet: ' + err);
    });
  }
}