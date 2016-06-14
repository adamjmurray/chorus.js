'use strict';
const Pattern = require('./pattern');

/**
 * A Pattern defined in terms of a function takes it's last output as input
 * in the next iteration. In other words the previous output is "fed back" as the
 * next input. Mathematically, this is a "recurrence relation".
 *
 * The values argument determines the initial values and parity of the feedback function.
 */
class Feedback extends Pattern {

  constructor(values, func, options) {
    super(values, options);
    this.func = func;
  }

  *[Symbol.iterator]() {
    let func = this.func;
    let values = this.values;
    while (true) {
      yield values = func(values);
    }
  }

}

module.exports = Feedback;
