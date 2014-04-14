## IP to Country

[iptocountry](http://github.com/cmfatih/iptocountry) is a [node.js](http://nodejs.org) 
module for detecting country information of IP addresses without any API call.

iptocountry on [npm registry](http://npmjs.org/package/iptocountry)  

### Installation

For latest release
```
npm install iptocountry
```

For HEAD
```
git clone https://github.com/cmfatih/iptocountry.git
```

Permissions
```
chmod 775 ./data/
```

### Usage

#### Test
```
npm test
```

#### HTTP mode
```
npm start
```
See `http://localhost:12080/search?ip=74.125.225.71` or 
See `http://localhost:12080/search?ip=74.125.225.71,98.138.253.109`

#### Example

Download IP database if 48 hours passed. This is an example for cron script.
```javascript
var mIP2CO = require('iptocountry');

if(mIP2CO.dbCSVCheckExp(48)) {
  mIP2CO.dbGet().then(function() {
    console.log('done!');
  }, function(err) {
    console.log(err);
  });
}
// done!
```

-

Search IP addresses
```javascript
var mIP2CO = require('iptocountry');

var ipS = mIP2CO.ipSearch(['74.125.225.71', '98.138.253.109']);
if(!ipS.error) {
  console.log(ipS);
} else {
  console.log(ipS.error);
};

/*
{ data:
   { '74.125.225.71':
      { ip: '74.125.225.71',
        ipNum: 1249763655,
        registery: 'arin',
        assigned: '1173744000',
        coCode2: 'US',
        coCode3: 'USA',
        country: 'United States',
        time: '2007-03-12 20:00:00',
        found: true },
     '98.138.253.109':
      { ip: '98.138.253.109',
        ipNum: 1653276013,
        registery: 'arin',
        assigned: '1196985600',
        coCode2: 'US',
        coCode3: 'USA',
        country: 'United States',
        time: '2007-12-06 19:00:00',
        found: true } },
  warnings: [],
  timeE: 46 }
*/
```

-

Listen HTTP requests.
```javascript
var mIP2CO = require('iptocountry');

mIP2CO.dbLoad();
mIP2CO.listenHTTP({hostname: 'localhost', 'port': 12080});
```
See `http://localhost:12080/search?ip=74.125.225.71`  

For performance test; `ab -n 1000 http://localhost:12080/search?ip=74.125.225.71`

### Notes

* It uses [Webnet77](http://software77.net/geo-ip/) for IP database file. It represents 
the over 4 billion IPV4 numbers as well as the virtually inexhaustible IPV6 range (3.4e+38).
There is limit for downloads, for more information see [FAQ](http://software77.net/faq.html)

#### Implementations

* [x] IPv4
* [ ] IPv6

### Changelog

For all notable changes see [CHANGELOG.md](https://github.com/cmfatih/iptocountry/blob/master/CHANGELOG.md)

### License

Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/iptocountry)  
Licensed under The MIT License (MIT)  
For the full copyright and license information, please view the LICENSE.txt file.