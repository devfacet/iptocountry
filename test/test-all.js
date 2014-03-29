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

  if(!mIP2CO.dbFileCheck()) {
    mIP2CO.dbFileGet().then(function() {
      console.log('dbFileGet: done!');
    }, function(err) {
      console.log('dbFileGet: ' + err);
    });
  }
}