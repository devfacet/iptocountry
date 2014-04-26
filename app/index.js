// Init reqs
/* jslint node: true */
'use strict';

var ip2co  = require('../'),
    utilex = require('utilex')
;

// Init vars
var appArgs   = utilex.tidyArgs(),  // args
    appConfig = {isHeapdump: false} // config
;

// config
if(typeof appArgs['heapdump'] !== 'undefined') {
  var heapdump = require('heapdump');
  appConfig.isHeapdump = true;
}

// Loads the database and listen http requests.
function loadAndServe() {
  ip2co.dbLoad();
  ip2co.listenHTTP({hostname: 'localhost', 'port': 12080});
}

if(ip2co.dbCSVCheckExp(48)) {
  ip2co.dbGet().then(function() {
    loadAndServe();
  }, function(err) {
    utilex.tidyLog(err);
  });
} else {
  loadAndServe();
}

// heapdump
if(appConfig.isHeapdump === true) {
  heapdump.writeSnapshot(__dirname + '/dump-' + Date.now() + '.heapsnapshot');
}