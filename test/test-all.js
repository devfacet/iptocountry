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

    it('dataDirCheck() should run without any error (' + dataDirCheck + ')', function(done) {
      expect(dataDirCheck).to.be.a('boolean');
      done();
    });
  });

  describe('dbFileCheck', function() {
    var dbFileCheck = ip2co.dbFileCheck();

    it('dbFileCheck() should run without any error (' + dbFileCheck + ')', function(done) {
      expect(dbFileCheck).to.be.a('boolean');
      done();
    });
  });

  describe('dbCSVCheck', function() {
    var dbCSVCheck = ip2co.dbCSVCheck();

    it('dbCSVCheck() should run without any error (' + dbCSVCheck + ')', function(done) {
      expect(dbCSVCheck).to.be.a('boolean');
      done();
    });
  });

  describe('dbCSVCheckExp', function() {
    var dbCSVCheckExp = ip2co.dbCSVCheckExp(48);

    it('dbCSVCheckExp() should run without any error (' + dbCSVCheckExp + ')', function(done) {
      expect(dbCSVCheckExp).to.be.a('boolean');
      done();
    });
  });

  describe('dbLoad', function() {
    var dbLoad = ip2co.dbCSVCheck();

    it('dbLoad() should run without any error (' + dbLoad + ')', function(done) {
      expect(dbLoad).to.be.a('boolean');
      done();
    });
  });

  describe('ipSearch', function() {
    var ipSearch = ip2co.ipSearch(['74.125.225.71', '98.138.253.109']);

    if(ip2co.dbCSVCheck()) {
      it('ipSearch() should run without any error', function(done) {
        if(ipSearch.error) {
          done(ipSearch.error);
          return;
        }

        expect(ipSearch).to.be.a('object');
        expect(ipSearch).to.have.property('data');
        expect(ipSearch.data).to.be.a('object');
        expect(ipSearch.data).to.have.property('74.125.225.71');
        expect(ipSearch.data['74.125.225.71']).to.have.property('found', true);
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