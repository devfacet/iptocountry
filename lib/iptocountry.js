/*
 * IP to Country
 * Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/iptocountry)
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

// Init reqs
/* jslint node: true */
'use strict';

var fs     = require('fs'),
    path   = require('path'),
    utilex = require('utilex'),
    zlib   = require('zlib'),
    q      = require('q'),
    http   = require('http'),
    url    = require('url');

// Init the module
exports = module.exports = function() {

  var gzip           = zlib.createGunzip(),
      dataSet        = [],
      dataDirPath    = fs.realpathSync(__dirname + path.sep + '..') + path.sep + 'data',
      dbFileUrl      = 'http://software77.net/geo-ip/?DL=1',
      dbFilePath     = dataDirPath + path.sep + 'IpToCountry.csv.gz',
      dbCSVPath      = dataDirPath + path.sep + 'IpToCountry.csv',
      dataDirCheck,  // checks the data folder - function
      dbFileCheck,   // checks the database file - function
      dbCSVCheck,    // checks the database csv file - function
      dbCSVCheckExp, // checks the database csv file's expiration - function
      dbGet,         // gets the database - function
      dbLoad,        // loads the database - function
      ipSearch,      // search ip addresses - function
      listenHTTP;    // listen http requests - function

  // Checks whether the data directory exists and writable or not.
  dataDirCheck = function dataDirCheck() {
    return utilex.dirIsWritable(dataDirPath);
  };

  // Checks whether the database file exists or not.
  dbFileCheck = function dbFileCheck() {
    return fs.existsSync(dbFilePath);
  };

  // Checks whether the database csv file exists or not.
  dbCSVCheck = function dbCSVCheck() {
    return fs.existsSync(dbCSVPath);
  };

  // Checks whether the database csv file expired or not.
  dbCSVCheckExp = function dbCSVCheckExp(hour) {

    if(!dbCSVCheck()) return true;
    if(isNaN(parseInt(('' + hour), 10))) return true;

    var ss      = fs.statSync(dbCSVPath),
        modTime = (ss && ss.mtime && ss.mtime.getTime) ? ss.mtime.getTime() : 0,
        curTime = (new Date()).getTime(),
        difHrs  = (modTime) ? Math.floor((curTime-modTime)/(60*60*1000)) : 0,
        expHr   = parseInt(('' + hour), 10);

    if(expHr <= difHrs) return true;

    return false;
  };

  // Gets the database.
  dbGet = function dbGet() {

    var deferred = q.defer();

    // Get the file
    utilex.httpGetFile(dbFileUrl, dbFilePath).then(function() {

      // Save the file
      var rs = fs.createReadStream(dbFilePath),
          ws = fs.createWriteStream(dbCSVPath),
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

  dbLoad = function dbLoad(reload) {

    // Check the database
    if(!dbCSVCheck()) {
      return false;
    } else if(dataSet.length > 0 && reload !== true) {
      return true;
    }

    // Read the file
    var fields   = [],
        lines    = fs.readFileSync(dbCSVPath).toString().split("\n"),
        linesLen = lines.length,
        linesCB  = function(val, key) { fields[key] = val.replace(/"/g, ''); };

    for(var i = 0; i < linesLen; i++) {
      if(lines[i].indexOf('#') === 0) continue; // Check the line
      fields = [];
      lines[i].split(',').forEach(linesCB);
      if(fields.length !== 7) continue;         // Check the length
      dataSet.push(fields);                     // push the fields
    }

    return true;
  };

  // Returns the country information of the given IP address(es).
  ipSearch = function ipSearch(ip) {

    var result    = {data: {}, warnings: [], timeE: null},
        tsS       = new Date().getTime(),
        ipList    = {},
        ipListLen = 0,
        i         = 0;

    // Check the database
    if(!dbCSVCheck()) {
      return {error: 'Missing database file.'};
    } else if(!dbLoad()) {
      return {error: 'Database is not loaded!'};
    }

    // Find IP addresses
    var isAnyIP = false;

    if(ip) {
      if(typeof ip === 'string') ip = [ip];
      if(ip instanceof Array) {
        var ipF = null;
        for(i = 0; i < ip.length; i++) {
          ipF = ('' + ip[i]).trim();
          if(ipF) {
            var ts = ipF.split('.');

            if(ts.length !== 4) {
              result.warnings.push('Invalid IP address: ' + ipF);
            } else {
              ipList[ipF] = {
                ip: ipF,
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
              isAnyIP = true;
            }
          }
        }
      }
    }
    if(!isAnyIP) {
      return {error: 'Missing IP address.'};
    } else if(ipListLen > 10) {
      return {error: 'Too many IP addresses. (' + ipListLen + '/10)'};
    }

    var dsLen    = dataSet.length,
        fields   = [],
        doneCntr = 0;

    for(i = 0; i < dsLen; i++) {
      fields = dataSet[i];

      for(var key in ipList) {
        if(ipList[key].found === false && ipList[key].ipNum >= fields[0] && ipList[key].ipNum <= fields[1]) {
          var asgndDate         = new Date(fields[3]*1000);

          ipList[key].registery = fields[2];
          ipList[key].assigned  = fields[3];
          ipList[key].time      = new Date(asgndDate.toISOString().replace("Z", "+0" + (asgndDate.getTimezoneOffset()/60) + ":00")).toISOString().replace("T", " ").substr(0, 19);
          ipList[key].coCode2   = fields[4];
          ipList[key].coCode3   = fields[5];
          ipList[key].country   = fields[6];
          ipList[key].found     = true;
          doneCntr++;
        }
      }

      if(doneCntr === ipListLen) break;
    }

    result.data  = ipList;
    result.timeE = ((new Date().getTime())-tsS);

    return result;
  };

  // Listens http requests.
  listenHTTP = function listenHTTP(options) {

    var hostname = (options && options.hostname) ? options.hostname : 'localhost',
        port     = (options && options.port)     ? options.port     : 12080,
        resHdr   = {'Content-Type': 'application/json'};

    // create http server
    var server = http.createServer(function(req, res) {
      var up = url.parse(req.url, true, false);
      if(up && up.pathname) {
        var pathAry = up.pathname.split('/');
        if(pathAry[1] === 'search') {
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
      utilex.tidyLog('Server is listening on ' + server.address().address + ':' + server.address().port);
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