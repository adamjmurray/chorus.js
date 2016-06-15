/**
 * A pattern of values, provided in a sequence via an iterator.
 */
class Pattern {

  constructor(values, options = {}) {
    this.values = values;
    this.options = options;
  }

  *[Symbol.iterator]() {
    yield this.values;
  }

  *iterator() {
    yield *this[Symbol.iterator]();
  }
}

module.exports = Pattern;
