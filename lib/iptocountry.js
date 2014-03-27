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
    mRequest  = require('request')
;

// Init the module
exports = module.exports = function() {

  // Init vars
  var dataDirPath   = mFS.realpathSync(__dirname + mPath.sep + '..') + mPath.sep + 'data',
      dbFilePath    = dataDirPath + mPath.sep + 'IpToCountry.csv',
      dbFileUrl     = 'http://software77.net/geo-ip/?DL=1',

      checkDataDir, // checks the data folder - function
      checkDBFile   // checks the database file - function
  ;

  // Checks whether the data directory exists and writable or not.
  checkDataDir = function checkDataDir() {
    return mUtilex.dirIsWritable(dataDirPath);
  };

  // Checks whether the database file exists or not.
  checkDBFile = function checkDBFile() {
    return mFS.existsSync(dbFilePath);
  };

  return {
    checkDataDir: checkDataDir,
    checkDBFile: checkDBFile
  };
}();