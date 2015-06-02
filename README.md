[![Build Status](https://travis-ci.org/stojanovic/vreme.svg)](https://travis-ci.org/stojanovic/vreme) [![npm version](https://badge.fury.io/js/vreme.svg)](http://badge.fury.io/js/vreme)

<h1 align="center">
  <img width="320" src="https://rawgit.com/stojanovic/vreme/master/vreme.svg" alt="vreme">
  <br>
</h1>

Format date and time by providing human-readable example.

Vreme is a simple date/time converter with human readable format strings.

This module is mostly for simple and readable formatting, you should consider 
some other module for more complex date formats (ie. [this one](https://www.npmjs.com/package/strftime))

"Vreme" means Time in Serbian.

## Usage

Import Vreme and make a new instance, than you should simply provide date and 
human readable format.

If works with node.js and in the browser.

You can format full dates and times or just a month/day name, as you can see 
in the example below:

```

var Vreme = require('Vreme')

var vreme = new Vreme()

var date = new Date('Sat, 01 Aug 2015 14:10:21')

// To get month
console.log(vreme.format(date, 'January'))            // Output 'August'
console.log(vreme.format(date, 'Jan'))                // Aug
console.log(vreme.format(date, '12'))                 // 08
console.log(vreme.format(date, '2'))                  // 8

// To convert day names
console.log(vreme.format(date, 'Monday'))             // Saturday
console.log(vreme.format(date, 'monday'))             // saturday
console.log(vreme.format(date, 'Mon'))                // Sat
console.log(vreme.format(date, 'Mo'))                 // Sa
console.log(vreme.format(date, 'MO'))                 // SA
console.log(vreme.format(date, '1st'))                // 1st
console.log(vreme.format(date, '22'))                 // 01

// To get year
console.log(vreme.format(date, '1999'))               // 2015
console.log(vreme.format(date, '42'))                 // 15

// To get time
console.log(vreme.format(date, '4:10 pm'))            // '2:10 pm'
console.log(vreme.format(date, '15:32'))              // '14:10'

// To get full dates
console.log(vreme.format(date, 'March 25, 1999'))     // August 01, 2015
console.log(vreme.format(date, 'March 1, 1999'))      // August 1, 2015
console.log(vreme.format(date, 'March 25th'))         // August 1st
console.log(vreme.format(date, '2014/04/25'))         // 2015/08/01
console.log(vreme.format(date, '2014/04/25 4:10 am')) // 2015/08/01 2:10 pm
console.log(vreme.format(date, '02/03/11'))           // 08/01/15
console.log(vreme.format(date, '21.04.2015'))         // 01.08.2015

// Or you can combine it with text
console.log(vreme.format(date, 'Date: March, 25th'))  // Date: August, 1st


```

### With prototype

If you pass `usePrototype: true` in options Vreme will be added as a method
of Date object (`Date#formatLike`), so you can use it like this:

```

var Vreme = require('Vreme')

var vreme = new Vreme({
  usePrototype: true
})

var date = new Date('8/20/2015')

// Then you can get date like this
console.log(date.formatLike('March 25, 1999'))    // August 20, 2015


```

### In the browser

Just include vreme.js or vreme.min.js in scripts and use the module same as 
described above.

ie.

```

<!doctype html>
<html>
<head>
  <title>Vreme test</title>
</head>
<body>
  <script src="vreme.min.js"></script>
  <script>

    var vreme = new Vreme();

    var date = new Date();

    console.log(vreme.format(date, 'Monday'));

  </script>
</body>
</html>


```

## Limitations

This module is relying on regular expressions and I tried to keep it as simple 
as it's possible, so there is some limitations:

- If you are using integers smaller than 13 for month, year and day (ie. 
'02/03/11') module will always assume `MM/DD/YY` format;
- If you use integers between 13 and 31 for both year and day it'll assume (ie.
'02/14/14') it'll assume DD/YY format;
- At the moment it works only with month and day names in english.

There are additional limitation that are not on this list, they'll be added.

## Development

Vreme is written in ES6 and compiled with Babel.  
Intall Babel by running `npm i babel -g` than run `npm run compile` to 
transpile it to ES5.  

If you want to run Babel manually, you'll need to do: 
`babel src/index.js -o .tmp/vreme.js` and then `buildify` to 
add support for CommonJS, AMD and script and to make minified version.

## Test

Run `npm test` or `mocha -R spec ./test/index.js`.

## Todo

- [x] Parse time too;
- [x] Make it work in the browser without browserify;
- [ ] Memoization;
- [ ] Support other languages, it'll be a bit problematic to fix ordinal sufixes for
all languages, but everything else should be fine.
