const Pattern = require('./pattern');

/**
 * A Pattern that outputs the results of a function called on a time value that changes at the given speed rate.
 */
class LFO extends Pattern {

  constructor(func, options) {
    super([], options);
    this.func = func;
    this.speed = this.options.speed || 1;
    this.offset = this.options.offset || 0;
  }

  *[Symbol.iterator]() {
    let func = this.func;
    let time = this.offset;
    let speed = this.speed;
    while (true) {
      yield func(time);
      time += speed;
    }
  }

}

module.exports = LFO;
