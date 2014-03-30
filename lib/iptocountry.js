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
    mQ      = require('q')
;

// Init the module
exports = module.exports = function() {

  // Init vars
  var gzip          = mZlib.createGunzip(),

      dataDirPath   = mFS.realpathSync(__dirname + mPath.sep + '..') + mPath.sep + 'data',
      dbFileUrl     = 'http://software77.net/geo-ip/?DL=1',
      dbFilePath    = dataDirPath + mPath.sep + 'IpToCountry.csv.gz',
      dbCSVPath     = dataDirPath + mPath.sep + 'IpToCountry.csv',

      dataDirCheck, // checks the data folder - function
      dbFileCheck,  // checks the database file - function
      dbCSVCheck,   // checks the database csv file - function
      dbGet         // gets the database - function
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

  // Gets the database
  dbGet = function dbGet() {

    // Init vars
    var deferred  = mQ.defer();

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
  }

  return {
    dataDirCheck: dataDirCheck,
    dbFileCheck: dbFileCheck,
    dbCSVCheck: dbCSVCheck,
    dbGet: dbGet
  };
}();