import { expect } from 'chai'
import Vreme from '../src/index'

let stamp

const date = new Date('Sat, 01 Aug 2015 2:10:21')

describe('Human Readable Time format', () => {

  before(() => stamp = new Vreme({
    usePrototype: true
  }))

  describe('Month conversion', () => {

    it('should convert date to full month name', () => expect(stamp.format(date, 'January')).to.equal('August'))

    it('should convert date to three letters month name', () => expect(stamp.format(date, 'Jan')).to.equal('Aug'))

    it('should convert date to all caps three letters month name', () => expect(stamp.format(date, 'JAN')).to.equal('AUG'))

    it('should convert date to lower case three letters month name', () => expect(stamp.format(date, 'jan')).to.equal('aug'))

  })

  describe('Day conversion', () => {

    it('should convert date to full day name', () => expect(stamp.format(date, 'Monday')).to.equal('Saturday'))

    it('should convert date to three letters day name', () => expect(stamp.format(date, 'Mon')).to.equal('Sat'))

    it('should convert date to two letters day name', () => expect(stamp.format(date, 'Mo')).to.equal('Sa'))

    it('should convert date to all caps two letters day name', () => expect(stamp.format(date, 'MO')).to.equal('SA'))

    it('should convert date to lowercase day name', () => expect(stamp.format(date, 'monday')).to.equal('saturday'))

    it('should convert date to ordinal day number (st)', () => expect(stamp.format(date, '1st')).to.equal('1st'))

    it('should convert date to ordinal day number (nd)', () => expect(stamp.format(new Date('Sun, 02 Aug 2015 2:10:21'), '1st')).to.equal('2nd'))

    it('should convert date to ordinal day number (rd)', () => expect(stamp.format(new Date('Mon, 03 Aug 2015 2:10:21'), '1st')).to.equal('3rd'))

    it('should convert date to ordinal day number (th)', () => expect(stamp.format(new Date('Tue, 04 Aug 2015 2:10:21'), '1st')).to.equal('4th'))

    it('should convert date to two numbers day format', () => expect(stamp.format(date, '24')).to.equal('01'))

  })

  describe('Year conversion', () => {

    it('should show 4 letter year', () => expect(stamp.format(date, '1999')).to.equal('2015'))

    it('should show 2 letter year for values between 32 and 99', () => expect(stamp.format(date, '35')).to.equal('15'))

  })

  describe('Time conversion', () => {

    it('should parse time in H:MM format', () => expect(stamp.format(date, '5:00')).to.equal('2:10'))

    it('should parse time in HH:MM format', () => expect(stamp.format(date, '17:10')).to.equal('02:10'))

    it('should parse time in H:MM:SS format', () => expect(stamp.format(date, '5:10:30')).to.equal('2:10:21'))

    it('should parse time in HH:MM:SS format', () => expect(stamp.format(date, '15:10:30')).to.equal('02:10:21'))

    it('should parse time in H:MM AM/PM format', () => expect(stamp.format(date, '5:10 pm')).to.equal('2:10 am'))

    it('should parse time in HH:MM AM/PM format for hours > 12', () => expect(stamp.format(new Date('Sat, 01 Aug 2015 14:10:21'), '11:10 pm')).to.equal('02:10 pm'))

    it('should parse time in HH:MMam/pm format', () => expect(stamp.format(date, '03:20pm')).to.equal('02:10am'))

  })

  describe('Combined conversions', () => {

    it('should format date in Monthname D, YYYY format', () => expect(stamp.format(date, 'March 25, 1999')).to.equal('August 01, 2015'))

    it('should format date in Monthname Dth format', () => expect(stamp.format(date, 'March 25th')).to.equal('August 1st'))

    it('should format date in YYYY/MM/DD format', () => expect(stamp.format(date, '2014/04/25')).to.equal('2015/08/01'))

    it('should format date in YY/MM/DD format', () => expect(stamp.format(date, '42/04/25')).to.equal('15/08/01'))

    it('should format date in MM/DD/YY format', () => expect(stamp.format(date, '10/10/10')).to.equal('08/01/15'))

    it('should format date in DD.MM.YYYY format', () => expect(stamp.format(date, '21.04.2015')).to.equal('01.08.2015'))

    it('should format date in YYYY/MM/DD HH:MM:SS format', () => expect(stamp.format(date, '21.04.2015 14:04:31')).to.equal('01.08.2015 02:10:21'))

    it('should format date in Monthname D, YYYY H:MM am/pm format', () => expect(stamp.format(date, 'March 25, 1999 2:04 PM')).to.equal('August 01, 2015 2:10 AM'))

    it('should keep the extraneous text', () => expect(stamp.format(date, 'Date: March, 25th')).to.equal('Date: August, 1st'))

    it('should keep the extraneous text after time', () => expect(stamp.format(date, 'Date: March, 25th 1:10pm lorem ipsum')).to.equal('Date: August, 1st 2:10am lorem ipsum'))

  });

  describe('Using prototype', () => it('should format date in YYYY/MM/DD format', () => expect(date.formatLike('2014/04/25')).to.equal('2015/08/01')))

});
