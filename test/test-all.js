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

// Loads the database and search ip addresses.
function loadAndSearch() {
  console.log('dbLoad: ' + mIP2CO.dbLoad());

  var ipS = mIP2CO.ipSearch(['74.125.225.71', '98.138.253.109']);
  if(!ipS.error) {
    console.log('ipSearch: ' + ipS.timeE + 'ms');
    console.log(ipS);
  } else {
    console.log('ipSearch: ' + ipS.error);
  }
}

// Test for mics. features
if(gTestList.MISC === true) {
  console.log('dataDirCheck: ' + mIP2CO.dataDirCheck());
  console.log('dbFileCheck: ' + mIP2CO.dbFileCheck());
  console.log('dbFileCheck: ' + mIP2CO.dbFileCheck());
  console.log('dbCSVCheck: ' + mIP2CO.dbCSVCheck());
  console.log('dbCSVCheckExp: ' + mIP2CO.dbCSVCheckExp(48));

  if(mIP2CO.dbCSVCheckExp(48)) {
    mIP2CO.dbGet().then(function() {
      console.log('dbGet: DONE!');
      loadAndSearch();
    }, function(err) {
      console.log('dbGet: ' + err);
    });
  } else {
    loadAndSearch();
  }
}