const Pattern = require('./pattern');

/**
 * Iterates over a list of values.
 */
class List extends Pattern {

  *[Symbol.iterator]() {
    let index = 0;
    let values = this.values;
    while (index < values.length) {
      let value = values[index];
      value instanceof Pattern ? yield *value : yield value;
      index++;
    }
  }

}

module.exports = List;
