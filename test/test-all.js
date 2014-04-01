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
  console.log('dbFileCheck: ' + mIP2CO.dbFileCheck());
  console.log('dbCSVCheck: ' + mIP2CO.dbCSVCheck());
  console.log('dbCSVCheckExp: ' + mIP2CO.dbCSVCheckExp(48));

  if(mIP2CO.dbCSVCheckExp(48)) {
    mIP2CO.dbGet().then(function() {
      console.log('dbGet: done!');
    }, function(err) {
      console.log('dbGet: ' + err);
    });
  }

  mIP2CO.ipSearch(['74.125.225.71', '127.0.0.1']).then(function(res) {
    console.log('ipSearch: ');
    console.log(res);
  }, function(err) {
    console.log('ipSearch: ' + err);
  });
}