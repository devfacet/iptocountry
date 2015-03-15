## IP to Country

[![NPM][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

IP to Country is a module for detecting country information of IP addresses without any API call.

### Installation

```
npm install iptocountry
```

### Usage

##### REST API

```
npm start
```
See `http://localhost:12080/search?ip=74.125.225.71` or `http://localhost:12080/search?ip=74.125.225.71,98.138.253.109`

##### Download IP database

```javascript
var ip2co = require('iptocountry');

if(ip2co.dbCSVCheckExp(48)) {
  ip2co.dbGet().then(function() {
    console.log('done!');
  }, function(err) {
    console.log(err);
  });
}
// done!
```

##### Search IP addresses

```javascript
var ip2co = require('iptocountry');

var ipSearch = ip2co.ipSearch(['74.125.225.71', '98.138.253.109']);
if(!ipSearch.error) {
  console.log(JSON.stringify(ipSearch, null, 2));
} else {
  console.log(ipSearch.error);
};

/*
{
  "data": {
    "74.125.225.71": {
      "ip": "74.125.225.71",
      "ipNum": 1249763655,
      "registery": "arin",
      "assigned": "1173744000",
      "coCode2": "US",
      "coCode3": "USA",
      "country": "United States",
      "time": "2007-03-13 00:00:00",
      "found": true
    },
    "98.138.253.109": {
      "ip": "98.138.253.109",
      "ipNum": 1653276013,
      "registery": "arin",
      "assigned": "1196985600",
      "coCode2": "US",
      "coCode3": "USA",
      "country": "United States",
      "time": "2007-12-07 00:00:00",
      "found": true
    }
  },
  "warnings": [],
  "timeE": 51
}
*/
```

##### Listen HTTP requests

```javascript
var ip2co = require('iptocountry');

ip2co.dbLoad();
ip2co.listenHTTP({hostname: 'localhost', 'port': 12080});
```
See `http://localhost:12080/search?ip=74.125.225.71`

For performance test; `ab -n 1000 http://localhost:12080/search?ip=74.125.225.71`

### Notes

* It uses [Webnet77](http://software77.net/geo-ip/) for IP database file. It represents
  the over 4 billion IPV4 numbers as well as the virtually inexhaustible IPV6 range (3.4e+38).
  There is limit for downloads, for more information see [FAQ](http://software77.net/faq.html)

#### Implementations

- [x] IPv4
- [ ] IPv6

### License

Licensed under The MIT License (MIT)  
For the full copyright and license information, please view the LICENSE.txt file.

[npm-url]: http://npmjs.org/package/iptocountry
[npm-image]: https://badge.fury.io/js/iptocountry.png

[travis-url]: https://travis-ci.org/cmfatih/iptocountry
[travis-image]: https://travis-ci.org/cmfatih/iptocountry.svg?branch=master