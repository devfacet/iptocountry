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
    mUtilex   = require('utilex')
;

// Init the module
exports = module.exports = function() {

  // Init vars
  var dataDirPath   = mFS.realpathSync(__dirname + mPath.sep + '..') + mPath.sep + 'data',
      dbFilePath    = dataDirPath + mPath.sep + 'IpToCountry.csv.gz',
      dbFileUrl     = 'http://software77.net/geo-ip/?DL=1',

      dataDirCheck, // checks the data folder - function
      dbFileCheck,  // checks the database file - function
      dbFileGet     // gets the database file - function
  ;

  // Checks whether the data directory exists and writable or not.
  dataDirCheck = function dataDirCheck() {
    return mUtilex.dirIsWritable(dataDirPath);
  };

  // Checks whether the database file exists or not.
  dbFileCheck = function dbFileCheck() {
    return mFS.existsSync(dbFilePath);
  };

  // Gets the database file
  dbFileGet = function dbFileGet() {
    return mUtilex.httpGetFile(dbFileUrl, dbFilePath);
  }

  return {
    dataDirCheck: dataDirCheck,
    dbFileCheck: dbFileCheck,
    dbFileGet: dbFileGet
  };
}();