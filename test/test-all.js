// Init reqs
/* jslint node: true */
/* global describe: false */
/* global it: false */
'use strict';

var ip2co  = require('../'),
    expect = require('chai').expect
;

// Tests

// Test for iptocountry module
describe('iptocountry', function() {

  describe('dataDirCheck', function() {
    var dataDirCheck = ip2co.dataDirCheck();

    it('should check data directory (' + dataDirCheck + ')', function(done) {
      expect(dataDirCheck).to.be.a('boolean');
      done();
    });
  });

  describe('dbFileCheck', function() {
    var dbFileCheck = ip2co.dbFileCheck();

    it('should check database file (' + dbFileCheck + ')', function(done) {
      expect(dbFileCheck).to.be.a('boolean');
      done();
    });
  });

  describe('dbCSVCheck', function() {
    var dbCSVCheck = ip2co.dbCSVCheck();

    it('should check CSV file (' + dbCSVCheck + ')', function(done) {
      expect(dbCSVCheck).to.be.a('boolean');
      done();
    });
  });

  describe('dbCSVCheckExp', function() {
    var dbCSVCheckExp = ip2co.dbCSVCheckExp(48);

    it('should check expiration (' + dbCSVCheckExp + ')', function(done) {
      expect(dbCSVCheckExp).to.be.a('boolean');
      done();
    });
  });

  describe('dbLoad', function() {
    var dbLoad = ip2co.dbCSVCheck();

    it('should load database (' + dbLoad + ')', function(done) {
      expect(dbLoad).to.be.a('boolean');
      done();
    });
  });

  describe('ipSearch', function() {
    var ipSearch = ip2co.ipSearch(['74.125.225.71', '98.138.253.109']);

    if(ip2co.dbCSVCheck()) {
      it('should search and find IP addresses', function(done) {

        if(ipSearch.error) {
          done(ipSearch.error);
          return;
        }

        var ipToCheck = '74.125.225.71';
        expect(ipSearch).to.be.a('object');
        expect(ipSearch).to.have.property('data');
        expect(ipSearch.data).to.be.a('object');
        expect(ipSearch.data).to.have.property(ipToCheck);
        expect(ipSearch.data[ipToCheck]).to.have.property('ip');
        expect(ipSearch.data[ipToCheck]).to.have.property('ipNum');
        expect(ipSearch.data[ipToCheck]).to.have.property('registery');
        expect(ipSearch.data[ipToCheck]).to.have.property('assigned');
        expect(ipSearch.data[ipToCheck]).to.have.property('coCode2');
        expect(ipSearch.data[ipToCheck]).to.have.property('coCode3');
        expect(ipSearch.data[ipToCheck]).to.have.property('country');
        expect(ipSearch.data[ipToCheck]).to.have.property('time');
        expect(ipSearch.data[ipToCheck]).to.have.property('found', true);
        done();
      });
    } else {
      it('ipSearch() should fail due missing database file (' + ipSearch.error + ')', function(done) {
        if(!ipSearch.error) {
          done('Should give error!');
          return;
        }

        done();
      });      
    }
  });

  if(ip2co.dbCSVCheckExp(48)) {
  }
});