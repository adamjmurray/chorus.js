module.exports = {
  // modulo function that always returns a positive number
  mod(dividend, divisor) {
    let value = dividend % divisor;
    if (value < 0) value += divisor;
    return value;
  },

  clamp(value, min, max) {
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
  },
};
