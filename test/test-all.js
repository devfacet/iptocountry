// Init reqs
/* jslint node: true */
'use strict';

var ip2co   = require('../'),
    utilex  = require('utilex')
;

// Init vars
var testList = {MISC: true};

// Tests
utilex.tidyLog('test-all.js');

// Loads the database and search ip addresses.
function loadAndSearch() {
  utilex.tidyLog('dbLoad: ' + ip2co.dbLoad());

  var ipS = ip2co.ipSearch(['74.125.225.71', '98.138.253.109']);
  if(!ipS.error) {
    utilex.tidyLog('ipSearch: ' + ipS.timeE + 'ms');
    console.log(JSON.stringify(ipS, null, 2));
  } else {
    utilex.tidyLog('ipSearch: ' + ipS.error);
  }
}

// Test for mics. features
if(testList.MISC === true) {
  utilex.tidyLog('dataDirCheck: ' + ip2co.dataDirCheck());
  utilex.tidyLog('dbFileCheck: ' + ip2co.dbFileCheck());
  utilex.tidyLog('dbFileCheck: ' + ip2co.dbFileCheck());
  utilex.tidyLog('dbCSVCheck: ' + ip2co.dbCSVCheck());
  utilex.tidyLog('dbCSVCheckExp: ' + ip2co.dbCSVCheckExp(48));

  if(ip2co.dbCSVCheckExp(48)) {
    ip2co.dbGet().then(function() {
      utilex.tidyLog('dbGet: DONE!');
      loadAndSearch();
    }, function(err) {
      utilex.tidyLog('dbGet: ' + err);
    });
  } else {
    loadAndSearch();
  }
}