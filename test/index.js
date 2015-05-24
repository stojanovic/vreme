var expect = require('chai').expect;
var Vreme  = require('../');

var stamp;

describe('Human Readable Time format', function () {

  before(function() {

    stamp = new Vreme({
      usePrototype: true
    });

  });

  describe('Month conversion', function() {

    it('should convert date to full month name', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'January')).to.equal('February');

    });

    it('should convert date to three letters month name', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'Jan')).to.equal('Feb');

    });

  });

  describe('Day conversion', function() {

    it('should convert date to full day name', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'Monday')).to.equal('Saturday');

    });

    it('should convert date to three letters day name', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'Mon')).to.equal('Sat');

    });

    it('should convert date to two letters day name', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'Mo')).to.equal('Sa');

    });

    it('should convert date to ordinal day number', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '1st')).to.equal('14th');

    });

    it('should convert date to two numbers day format', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '24')).to.equal('14');

    });

  });

  describe('Year conversion', function() {

    it('should show 4 letter year', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '1999')).to.equal('2015');

    });

    it('should show 2 letter year for values between 32 and 99', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '35')).to.equal('15');

    });

  });

  describe('Combined conversions', function() {

    it('should format date in Monthname D, YYYY format', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'March 25, 1999')).to.equal('February 14, 2015');

    });

    it('should format date in Monthname Dth format', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'March 25th')).to.equal('February 14th');

    });

    it('should format date in YYYY/MM/DD format', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '2014/04/25')).to.equal('2015/02/14');

    });

    it('should format date in YY/MM/DD format', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '42/04/25')).to.equal('15/02/14');

    });

    it('should format date in DD.MM.YYYY format', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, '21.04.2015')).to.equal('14.02.2015');

    });

    it('should keep the extraneous text', function() {

      var date = new Date('2/14/2015');

      expect(stamp.format(date, 'Date: March, 25th')).to.equal('Date: February, 14th');

    });

  });

  describe('Using prototype', function() {

    it('should format date in YYYY/MM/DD format', function() {

      var date = new Date('2/14/2015');

      expect(date.formatLike('2014/04/25')).to.equal('2015/02/14');

    });

  });

});
