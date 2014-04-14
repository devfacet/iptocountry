/*
 * IP to Country
 * Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/iptocountry)
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

// Init reqs
/* jslint node: true */
'use strict';

var mFS     = require('fs'),
    mPath   = require('path'),
    mUtilex = require('utilex'),
    mZlib   = require('zlib'),
    mQ      = require('q'),
    mHTTP   = require('http'),
    mURL    = require('url')
;

// Init the module
exports = module.exports = function() {

  // Init vars
  var gzip            = mZlib.createGunzip(),
      gDataSet        = [],

      dataDirPath     = mFS.realpathSync(__dirname + mPath.sep + '..') + mPath.sep + 'data',
      dbFileUrl       = 'http://software77.net/geo-ip/?DL=1',
      dbFilePath      = dataDirPath + mPath.sep + 'IpToCountry.csv.gz',
      dbCSVPath       = dataDirPath + mPath.sep + 'IpToCountry.csv',

      dataDirCheck,   // checks the data folder - function
      dbFileCheck,    // checks the database file - function
      dbCSVCheck,     // checks the database csv file - function
      dbCSVCheckExp,  // checks the database csv file's expiration - function
      dbGet,          // gets the database - function
      dbLoad,         // loads the database - function

      ipSearch,       // search ip addresses - function
      listenHTTP      // listen http requests - function
  ;

  // Checks whether the data directory exists and writable or not.
  dataDirCheck = function dataDirCheck() {
    return mUtilex.dirIsWritable(dataDirPath);
  };

  // Checks whether the database file exists or not.
  dbFileCheck = function dbFileCheck() {
    return mFS.existsSync(dbFilePath);
  };

  // Checks whether the database csv file exists or not.
  dbCSVCheck = function dbCSVCheck() {
    return mFS.existsSync(dbCSVPath);
  };

  // Checks whether the database csv file expired or not.
  dbCSVCheckExp = function dbCSVCheckExp(iHour) {

    // Check reqs
    if(!dbCSVCheck()) return true;
    if(isNaN(parseInt(('' + iHour), 10))) return true;

    // Init vars
    var ss      = mFS.statSync(dbCSVPath),
        modTime = (ss && ss.mtime && ss.mtime.getTime) ? ss.mtime.getTime() : 0,
        curTime = (new Date()).getTime(),
        difHrs  = (modTime) ? Math.floor((curTime-modTime)/(60*60*1000)) : 0,
        expHr   = parseInt(('' + iHour), 10)
    ;

    if(expHr <= difHrs) return true;

    return false;
  };

  // Gets the database.
  dbGet = function dbGet() {

    // Init vars
    var deferred = mQ.defer();

    // Get the file
    mUtilex.httpGetFile(dbFileUrl, dbFilePath).then(function() {

      // Save the file
      var rs = mFS.createReadStream(dbFilePath),
          ws = mFS.createWriteStream(dbCSVPath),
          ps = rs.pipe(gzip).pipe(ws)
      ;

      ps.on('finish', function() {
        deferred.resolve(null);
      });
      ps.on('error', function(err) {
        deferred.reject(err);
      });
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  dbLoad = function dbLoad(iReload) {

    // Check the database
    if(!dbCSVCheck()) {
      return false;
    } else if(gDataSet.length > 0 && iReload !== true) {
      return true;
    }

    // Read the file
    var lines     = mFS.readFileSync(dbCSVPath).toString().split("\n"),
        linesLen  = lines.length,
        fields    = [],
        fForEach  = function(val, key) { fields[key] = val.replace(/"/g, ''); }
    ;

    for(var i = 0; i < linesLen; i++) {
      if(lines[i].indexOf('#') === 0) continue; // Check the line
      fields = [];
      lines[i].split(',').forEach(fForEach);
      if(fields.length != 7) continue; // Check the length
      gDataSet.push(fields); // push the fields
    }

    return true;
  };

  // Returns the country information of the given IP address(es).
  ipSearch = function ipSearch(iIP) {

    // Init vars
    var result    = {data: {}, warnings: [], timeE: null},
        tsS       = new Date().getTime(),
        ipList    = {},
        ipListLen = 0,
        i         = 0
    ;

    // Check the database
    if(!dbCSVCheck()) {
      return {error: 'Missing database file.'};
    } else if(!dbLoad()) {
      return {error: 'Database is not loaded!'};
    }

    // Init IP addresses
    var tFound = false;

    if(iIP) {
      if(typeof iIP === 'string') iIP = [iIP];
      if(iIP instanceof Array) {
        var tIP    = null;
        for(i = 0; i < iIP.length; i++) {
          tIP = ('' + iIP[i]).trim();
          if(tIP) {
            var ts = tIP.split('.');

            if(ts.length != 4) {
              result.warnings.push('Invalid IP address: ' + tIP);
            } else {
              ipList[tIP] = {
                ip: tIP,
                ipNum: parseInt(ts[3], 10) + (parseInt(ts[2], 10) * 256) + (parseInt(ts[1], 10) * 256 * 256) + (parseInt(ts[0], 10) * 256 * 256 * 256),
                registery: null,
                assigned: null,
                coCode2: null,
                coCode3: null,
                country: null,
                time: null,
                found: false
              };
              ipListLen++;
              tFound = true;
            }
          }
        }
      }
    }
    if(!tFound) {
      return {error: 'Missing IP address.'};
    }

    // Init vars
    var dsLen     = gDataSet.length,
        fields    = [],
        doneCntr  = 0
    ;

    for(i = 0; i < dsLen; i++) {
      fields = gDataSet[i];

      for(var key in ipList) {
        if(ipList[key].found === false && ipList[key].ipNum >= fields[0] && ipList[key].ipNum <= fields[1]) {
          var tDate             = new Date(fields[3]*1000);

          ipList[key].registery = fields[2];
          ipList[key].assigned  = fields[3];
          ipList[key].time      = new Date(tDate.toISOString().replace("Z", "+0" + (tDate.getTimezoneOffset()/60) + ":00")).toISOString().replace("T", " ").substr(0, 19);
          ipList[key].coCode2   = fields[4];
          ipList[key].coCode3   = fields[5];
          ipList[key].country   = fields[6];
          ipList[key].found     = true;
          doneCntr++;
        }
      }

      if(doneCntr == ipListLen) break;
    }

    result.data  = ipList;
    result.timeE = ((new Date().getTime())-tsS);

    return result;
  };

  // Listens http requests.
  listenHTTP = function listenHTTP(iParam) {

    // Init vars
    var hostname  = (iParam && iParam.hostname) ? iParam.hostname : 'localhost',
        port      = (iParam && iParam.port)     ? iParam.port     : 12080,
        resHdr    = {'Content-Type': 'application/json'}
    ;

    // Init http
    var server = mHTTP.createServer(function(req, res) {

      var up = mURL.parse(req.url, true, false);
      //console.log(up); // for debug

      if(up && up.pathname) {
        var pathAry = up.pathname.split('/');
        //console.log(pathAry); // for debug

        if(pathAry[1] == 'search') {
          var ipAry = (up.query && up.query.ip) ? ('' + up.query.ip).split(',') : null,
              ipS   = ipSearch(ipAry)
          ;
          if(!ipS.error) {
            res.writeHead(200, resHdr);
            res.end(JSON.stringify(ipS));
          } else {
            res.writeHead(404, resHdr);
            res.end(JSON.stringify({code: '404', message: ipS.error}));
          }
        } else if(pathAry[1]) {
          res.writeHead(501, resHdr);
          res.end(JSON.stringify({code: '501', message: 'Not Implemented'}));
        } else {
          res.writeHead(200, resHdr);
          res.end();
        }
      }
    }).listen(port, hostname, function() {
      mUtilex.tidyLog('Server is listening on ' + server.address().address + ':' + server.address().port);
    });
  };

  return {
    dataDirCheck: dataDirCheck,
    dbFileCheck: dbFileCheck,
    dbCSVCheck: dbCSVCheck,
    dbCSVCheckExp: dbCSVCheckExp,
    dbGet: dbGet,
    dbLoad: dbLoad,
    ipSearch: ipSearch,
    listenHTTP: listenHTTP
  };
}();