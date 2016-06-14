const Pattern = require('./pattern');

/**
 * Iterates a list of values repeatedly,
 * until an optional 'max' number of values is yielded.
 */
class Cycle extends Pattern {

  constructor(values, options = {}) {
    super(values, options);
    this.max = options.max;
    if (this.max == null) this.max = Infinity;
  }

  *[Symbol.iterator]() {
    let index = 0;
    let values = this.values;
    let max = this.max;
    while (index < max) {
      let value = values[index % values.length];
      value instanceof Pattern ? yield *value : yield value;
      index++;
    }
  }

}

module.exports = Cycle;
