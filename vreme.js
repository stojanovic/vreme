'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var Vreme = (function () {
    function Vreme(options) {
      var _this = this;

      _classCallCheck(this, Vreme);

      this.options = {
        monthNames: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        dayNames: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      };

      if (options && options.usePrototype) {
        (function () {
          var self = _this;

          Date.prototype.formatLike = function (formatString) {
            return self.format(this, formatString);
          };
        })();
      }

      this.regex = {
        MONTHNAMES_REGEXP: new RegExp('^(' + this.options.monthNames.join('|') + ')$', 'i'),
        MONTHNAMES_ABBR_REGEXP: new RegExp('^(' + this.options.monthNames.map(function (month) {
          return month.substr(0, 3);
        }).join('|') + ')$', 'i'),
        DAYNAMES_REGEXP: new RegExp('^(' + this.options.dayNames.join('|') + ')$', 'i'),
        DAYNAMES_ABBR_REGEXP: new RegExp('^(' + this.options.dayNames.map(function (day) {
          return day.substr(0, 3);
        }).join('|') + ')$', 'i'),
        DAYNAMES_SHORT_REGEXP: new RegExp('^(' + this.options.dayNames.map(function (day) {
          return day.substr(0, 2);
        }).join('|') + ')$', 'i'),
        ONE_DIGIT_REGEXP: /^\d{1}$/,
        TWO_DIGIT_REGEXP: /^\d{2}$/,
        FOUR_DIGIT_REGEXP: /^\d{4}$/,
        ORDINAL_DAY_REGEXP: /^(\d{1,2})(st|nd|rd|th)$/,
        TIME_REGEXP: /(\d{1,2})(:)(\d{2})(\s*)(:)?(\d{2})?(\s*)?([ap]m)?/i
      };

      this._reset();
    }

    _createClass(Vreme, [{
      key: 'format',
      value: function format(date, formatString) {
        var _this2 = this;

        this._reset();

        var time = formatString.split(this.regex.TIME_REGEXP);
        var before = time.splice(0, 1)[0];
        var after = time.pop();
        after = after || '';
        var formatedDate = before.split(/\b/).map(function (partial) {
          return _this2.formatDate(date, partial);
        });
        var formatedTime = [];
        if (time.length) formatedTime = time.map(function (partial, index) {
          return _this2.formatTime(date, partial, index, time);
        });
        return formatedDate.join('') + formatedTime.join('') + after;
      }
    }, {
      key: 'ordinalSuffix',
      value: function ordinalSuffix(day) {
        var j = day % 10,
            k = day % 100;
        if (j == 1 && k != 11) return day + 'st';
        if (j == 2 && k != 12) return day + 'nd';
        if (j == 3 && k != 13) return day + 'rd';
        return day + 'th';
      }
    }, {
      key: 'formatDate',
      value: function formatDate(date, format) {
        var _this3 = this;

        var bestMatch = function bestMatch(number, date, twoDigits) {
          if (number > 12 && number < 32 && !_this3.matches.day) {
            _this3.matches.day = true;
            return ('0' + date.getDate()).slice(-2);
          }

          if (number > 12 && !_this3.matches.year || number > 31) {
            _this3.matches.year = true;
            return date.getFullYear() + '';
          }

          if (!_this3.matches.month) {
            _this3.matches.month = true;
            var month = date.getMonth() + 1;
            if (twoDigits) return ('0' + month).slice(-2);
            return month + '';
          }

          if (!_this3.matches.day) {
            _this3.matches.day = true;
            if (twoDigits) return ('0' + date.getDate()).slice(-2);
            return date.getDate() + '';
          }

          if (!_this3.matches.year) {
            _this3.matches.year = true;
            if (twoDigits) return ('0' + date.getFullYear()).slice(-2);
            return date.getFullYear() + '';
          }

          _this3.reset();

          return bestMatch(number, date);
        };

        if (format.match(this.regex.MONTHNAMES_REGEXP)) {
          this.matches.month = true;
          return this._correctCase(format, this.options.monthNames[date.getMonth()]);
        }

        if (format.match(this.regex.MONTHNAMES_ABBR_REGEXP)) {
          this.matches.month = true;
          return this._correctCase(format, this.options.monthNames[date.getMonth()].substr(0, 3));
        }

        if (format.match(this.regex.DAYNAMES_REGEXP)) {
          this.matches.day = true;
          return this._correctCase(format, this.options.dayNames[date.getDay()]);
        }

        if (format.match(this.regex.DAYNAMES_ABBR_REGEXP)) {
          this.matches.day = true;
          return this._correctCase(format, this.options.dayNames[date.getDay()].substr(0, 3));
        }

        if (format.match(this.regex.DAYNAMES_SHORT_REGEXP)) {
          this.matches.day = true;
          return this._correctCase(format, this.options.dayNames[date.getDay()].substr(0, 2));
        }

        if (format.match(this.regex.FOUR_DIGIT_REGEXP)) {
          this.matches.year = true;
          return date.getFullYear() + '';
        }

        if (format.match(this.regex.ORDINAL_DAY_REGEXP)) {
          this.matches.day = true;
          return this.ordinalSuffix(date.getDate());
        }

        if (format.match(this.regex.TWO_DIGIT_REGEXP)) {
          var number = parseInt(format, 10);

          if (number > 31 && number < 100) {
            this.matches.year = true;
            return (date.getFullYear() + '').substring(2, 4);
          }

          return bestMatch(number, date, true);
        }

        if (format.match(this.regex.ONE_DIGIT_REGEXP)) {
          var number = parseInt(format, 10);
          return bestMatch(number, date);
        }

        return format;
      }
    }, {
      key: 'formatTime',
      value: function formatTime(dateTime, format, index, fullTime) {
        var _this4 = this;

        var getAmPm = function getAmPm(format, hours) {
          var ampm = hours < 12 ? 'am' : 'pm';
          if (_this4._isAllCaps(format)) return ampm.toUpperCase();
          return ampm;
        };

        if (index === 0 && format.match(this.regex.ONE_DIGIT_REGEXP)) return dateTime.getHours();
        if (index === 0 && format.match(this.regex.TWO_DIGIT_REGEXP)) if (fullTime[7] && dateTime.getHours() > 12) {
          return ('0' + (dateTime.getHours() - 12)).slice(-2);
        } else {
          return ('0' + dateTime.getHours()).slice(-2);
        }
        if (index === 2 && format.match(this.regex.TWO_DIGIT_REGEXP)) return ('0' + dateTime.getMinutes()).slice(-2);
        if (format && index === 5 && format.match(this.regex.TWO_DIGIT_REGEXP)) return ('0' + dateTime.getSeconds()).slice(-2);
        if (format && index === 7) return dateTime.getHours() < 12 ? this._correctCase(format, 'am') : this._correctCase(format, 'pm');
        return format;
      }
    }, {
      key: '_reset',
      value: function _reset() {
        this.matches = {
          month: false,
          day: false,
          year: false
        };
      }
    }, {
      key: '_isCapital',
      value: function _isCapital(str) {
        return str.charAt(0) === str.charAt(0).toUpperCase();
      }
    }, {
      key: '_isLowercase',
      value: function _isLowercase(str) {
        return str === str.toLowerCase();
      }
    }, {
      key: '_isAllCaps',
      value: function _isAllCaps(str) {
        return str === str.toUpperCase();
      }
    }, {
      key: '_toCapital',
      value: function _toCapital(str) {
        return str.charAt(0).toUpperCase() + str.slice(1, str.length);
      }
    }, {
      key: '_correctCase',
      value: function _correctCase(format, str) {
        if (this._isLowercase(format)) return str.toLowerCase();
        if (this._isAllCaps(format)) return str.toUpperCase();
        if (this._isCapital(format)) return this._toCapital(str);
        return str;
      }
    }]);

    return Vreme;
  })();

  exports.default = Vreme;
});
