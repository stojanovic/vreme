export default class Vreme {

  constructor(options) {

    // Default options, should merge them with passed options in future
    this.options = {
      monthNames:   ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayNames:     ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }

    // Use Date prototype,
    // ie. `let date = new Date(); date.format_like('2015/11/22');`
    if (options && options.usePrototype) {
      // Arrow functions don't work here because we need `this` from
      // both class and function
      let self = this
      Date.prototype.formatLike = function(formatString) {
        return self.format(this, formatString)
      }
    }

    // Define all regular expressions
    this.regex = {
      MONTHNAMES_REGEXP:      new RegExp(`^(${this.options.monthNames.join('|')})$`, 'i'),
      MONTHNAMES_ABBR_REGEXP: new RegExp(`^(${this.options.monthNames.map(month => month.substr(0, 3)).join('|')})$`, 'i'),
      DAYNAMES_REGEXP:        new RegExp(`^(${this.options.dayNames.join('|')})$`, 'i'),
      DAYNAMES_ABBR_REGEXP:   new RegExp(`^(${this.options.dayNames.map(day => day.substr(0, 3)).join('|')})$`, 'i'),
      DAYNAMES_SHORT_REGEXP:  new RegExp(`^(${this.options.dayNames.map(day => day.substr(0, 2)).join('|')})$`, 'i'),
      ONE_DIGIT_REGEXP:       /^\d{1}$/,
      TWO_DIGIT_REGEXP:       /^\d{2}$/,
      FOUR_DIGIT_REGEXP:      /^\d{4}$/,
      ORDINAL_DAY_REGEXP:     /^(\d{1,2})(st|nd|rd|th)$/,
      TIME_REGEXP:            /(\d{1,2})(:)(\d{2})(\s*)(:)?(\d{2})?(\s*)?([ap]m)?/i
    }

    // Call reset method first, because we want a clean start
    this.reset()
  }

  reset() {
    // Reset an object we are using for a best match
    this.matches = {
      month: false,
      day:   false,
      year:  false
    }
  }

  // Main function
  format(date, formatString) {

    // Call reset method first, because we want a clean start
    this.reset()

    // Split format string by time
    let time   = formatString.split(this.regex.TIME_REGEXP)
    // Than get first element from array, because it should contain date
    let before = time.splice(0, 1)[0]
    // And the last one because it should stay the same
    let after  = time.pop()
    // When there's no time, last element is empty, so we need to check that too
    after = after || ''

    // Split date and format each part
    let formatedDate = before.split(/\b/).map(partial => this.formatDate(date, partial))
    let formatedTime = []

    if (time.length)
      formatedTime = time.map((partial, index) => this.formatTime(date, partial, index, time));

    // Merge and return the result
    // Time should be parsed too, but at the moment we are just returning it
    return formatedDate.join('') + formatedTime.join('') + after

  }

  // Handle ordinal suffixes
  // This could be a problem for other languages
  //
  // Args:
  //
  // - `day` (integer) - Day of the month
  //
  // Return:
  //
  // String representation of day with ordinal sufix
  ordinalSuffix(day) {

    let j = day % 10,
        k = day % 100

    if (j == 1 && k != 11)
      return day + 'st'

    if (j == 2 && k != 12)
      return day + 'nd'

    if (j == 3 && k != 13)
      return day + 'rd'

    return day + 'th'

  }

  // Format date partial
  //
  // Args:
  //
  // - `date` (Date) - Valid JavaScript date object
  // - `format` (String) - Part of a format string, use `format` for full string
  //
  // Return:
  //
  // Formated date partial (String)
  formatDate(date, format) {

    // Best match function
    let bestMatch = (number, date, twoDigits) => {
      // There is a better way to do this, but this should work now

      // If it's between 13 and 31 and day is not yet set
      if (number > 12 && number < 32 && !this.matches.day) {
        this.matches.day = true
        return ('0' + date.getDate()).slice(-2)
      }

      // If it's > 31 and year is not yet set
      if ((number > 12 && !this.matches.year) || number > 31) {
        this.matches.year = true
        return date.getFullYear() + ''
      }

      // Then first check if month is set
      if (!this.matches.month) {
        this.matches.month = true
        let month = date.getMonth() + 1
        if (twoDigits)
          return ('0' + month).slice(-2)
        return month + ''
      }

      // Then day
      if (!this.matches.day) {
        this.matches.day = true
        if (twoDigits)
          return ('0' + date.getDate()).slice(-2)
        return date.getDate() + ''
      }

      // And finally year
      if (!this.matches.year) {
        this.matches.year = true
        if (twoDigits)
          return ('0' + date.getFullYear()).slice(-2)
        return date.getFullYear() + ''
      }

      // Otherwise reset object
      this.reset()

      // Then call the function again
      return bestMatch(number, date)

    }

    // Check if format string is full month name
    if (format.match(this.regex.MONTHNAMES_REGEXP)) {
      this.matches.month = true
      return this.options.monthNames[date.getMonth()]
    }

    // Check if format string is short month name
    if (format.match(this.regex.MONTHNAMES_ABBR_REGEXP)) {
      this.matches.month = true
      return this.options.monthNames[date.getMonth()].substr(0, 3)
    }

    // Check if format string is full day name
    if (format.match(this.regex.DAYNAMES_REGEXP)) {
      this.matches.day = true
      return this.options.dayNames[date.getDay()]
    }

    // Check if format string is 3 letter day name
    if (format.match(this.regex.DAYNAMES_ABBR_REGEXP)) {
      this.matches.day = true
      return this.options.dayNames[date.getDay()].substr(0, 3)
    }

    // Check if format string is 2 letter day name
    if (format.match(this.regex.DAYNAMES_SHORT_REGEXP)) {
      this.matches.day = true
      return this.options.dayNames[date.getDay()].substr(0, 2)
    }

    // Check if format string is year (4 digits)
    if (format.match(this.regex.FOUR_DIGIT_REGEXP)) {
      this.matches.year = true
      return date.getFullYear() + ''
    }

    // Check if format string is day with ordinal sufix
    if (format.match(this.regex.ORDINAL_DAY_REGEXP)) {
      this.matches.day = true
      return this.ordinalSuffix(date.getDate())
    }

    // This is a bit more complicated
    // If format string is two digits, then
    if (format.match(this.regex.TWO_DIGIT_REGEXP)) {
      // Parse it as an integer
      let number = parseInt(format, 10)

      // Check if it's obvious year
      if (number > 31 && number < 100) {
        this.matches.year = true
        return (date.getFullYear() + '').substring(2, 4)
      }

      // Otherwise try to find the best match (it could be year, month or day)
      return bestMatch(number, date, true)
    }

    // This is a bit more complicated too
    // If format string is just one digits, then
    if (format.match(this.regex.ONE_DIGIT_REGEXP)) {
      // Parse it as an integer
      let number = parseInt(format, 10)

      // And try to find the best match (it could be month, day or maybe year,
      // but that's a bit unlikelly)
      return bestMatch(number, date)
    }

    // Otherwise just return format, because it is probably just a text
    return format

  }

  formatTime(dateTime, format, index, fullTime) {

    if (index === 0 && format.match(this.regex.ONE_DIGIT_REGEXP))
      return dateTime.getHours()

    if (index === 0 && format.match(this.regex.TWO_DIGIT_REGEXP))
      if (fullTime[7] && dateTime.getHours() > 12) {
        return ('0' + (dateTime.getHours() - 12)).slice(-2)
      } else {
        return ('0' + dateTime.getHours()).slice(-2)
      }

    if (index === 2 && format.match(this.regex.TWO_DIGIT_REGEXP))
      return ('0' + dateTime.getMinutes()).slice(-2)

    if (format && index === 5 && format.match(this.regex.TWO_DIGIT_REGEXP))
      return ('0' + dateTime.getSeconds()).slice(-2)

    if (format && index === 7)
      return (dateTime.getHours() < 12) ? 'am' : 'pm'

    return format

  }

}
