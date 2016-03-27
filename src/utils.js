'use strict';

module.exports = {
  // modulo function that always returns a positive number
  mod: function(dividend, divisor) {
    let value = dividend % divisor;
    if (value < 0) value += divisor;
    return value;
  },

  clamp: function(value, min, max) {
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
  },

};
