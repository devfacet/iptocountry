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
npm install
```

### Usage

#### Test
```
npm test
```

#### Example
```javascript
var mIP2CO = require('iptocountry');

// Download IP database (48 hours for expiration)
if(mIP2CO.dbCSVCheckExp(48)) {
  mIP2CO.dbGet().then(function() {
    console.log('done!');
  }, function(err) {
    console.log(err);
  });
}
// done!

// Search IP addresses
mIP2CO.ipSearch(['74.125.225.71', '127.0.0.1']).then(function(res) {
  console.log(res);
}, function(err) {
  console.log(err);
});

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
     '127.0.0.1':
      { ip: '127.0.0.1',
        ipNum: 2130706433,
        registery: 'iana',
        assigned: '410227200',
        coCode2: 'ZZ',
        coCode3: 'ZZZ',
        country: 'Reserved',
        time: '1982-12-31 19:00:00',
        found: true } },
  warnings: [] }
*/
```

### Notes

* It uses [Webnet77](http://software77.net/geo-ip/) for IP database file. It represents 
the over 4 billion IPV4 numbers as well as the virtually inexhaustible IPV6 range (3.4e+38).
There is limit for downloads, for more information see [FAQ](http://software77.net/faq.html)

#### Implementations

* [x] IPv4
* [ ] IPv6

#### Permissions

```
chmod 775 ../ipcountry/data/
```

### Changelog

For all notable changes see [CHANGELOG.md](https://github.com/cmfatih/iptocountry/blob/master/CHANGELOG.md)

### License

Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/iptocountry)  
Licensed under The MIT License (MIT)  
For the full copyright and license information, please view the LICENSE.txt file.