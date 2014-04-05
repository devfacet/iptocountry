/*
 * IP to Country
 * Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/iptocountry)
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

// Init reqs
/* jslint node: true */
'use strict';

var mFS       = require('fs'),
    mPath     = require('path'),
    mUtilex   = require('utilex'),
    mZlib     = require('zlib'),
    mQ        = require('q'),
    mStream   = require('stream'),
    mReadline = require('readline')
;

// Init the module
exports = module.exports = function() {

  // Init vars
  var gzip            = mZlib.createGunzip(),

      dataDirPath     = mFS.realpathSync(__dirname + mPath.sep + '..') + mPath.sep + 'data',
      dbFileUrl       = 'http://software77.net/geo-ip/?DL=1',
      dbFilePath      = dataDirPath + mPath.sep + 'IpToCountry.csv.gz',
      dbCSVPath       = dataDirPath + mPath.sep + 'IpToCountry.csv',

      dataDirCheck,   // checks the data folder - function
      dbFileCheck,    // checks the database file - function
      dbCSVCheck,     // checks the database csv file - function
      dbCSVCheckExp,  // checks the database csv file's expiration - function
      dbGet,          // gets the database - function

      ipSearch        // search ip addresses - function
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

  // Returns the country information of the given IP address(es).
  ipSearch = function ipSearch(iIP) {

    // Init vars
    var deferred  = mQ.defer(),
        result    = {data: {}, warnings: []},
        ipList    = {},
        i         = 0
    ;

    // Check the database
    if(!dbCSVCheck()) {
      deferred.reject('Missing database file.');
      return deferred.promise;
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

              tFound = true;
            }
          }
        }
      }
    }
    if(!tFound) {
      deferred.reject('Missing IP address.');
    }

    // Init stream
    var rs = mFS.createReadStream(dbCSVPath),
        ws = new mStream(),
        rl = mReadline.createInterface(rs, ws)
    ;

    // close event
    rl.on('close', function() {
      result.data = ipList;
      deferred.resolve(result);
    });

    // line event
    rl.on('line', function(line) {

      // Check the line
      if(line.indexOf('#') === 0) return;

      var fields = [];
      line.split(',').forEach(function(val, key) {
        fields[key] = val.replace(/"/g, '');
      });

      if(fields.length != 7) return;

      var doneTrig = true;

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
        }

        if(ipList[key].found === false) doneTrig = false;
      }

      if(doneTrig === true) rl.close();
    });

    return deferred.promise;
  };

  return {
    dataDirCheck: dataDirCheck,
    dbFileCheck: dbFileCheck,
    dbCSVCheck: dbCSVCheck,
    dbCSVCheckExp: dbCSVCheckExp,
    dbGet: dbGet,
    ipSearch: ipSearch
  };
}();