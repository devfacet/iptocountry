// Init reqs
/* jslint node: true */
'use strict';

var mIP2CO = require('../');

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
}