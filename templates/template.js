/*!
 * vreme.js - Format date and time by providing human-readable example.
 * https://github.com/stojanovic/vreme
 */

/*global define: false Vreme: true*/

(function(global, factory) {
  // CommonJS
  if (typeof exports === 'object' && exports) {
    module.exports = factory();
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  // global
  else {
    global.Vreme = factory();
  }
}(this, function () {

  {{body}}

  return Vreme;

}));
