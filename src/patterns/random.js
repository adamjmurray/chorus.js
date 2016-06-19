const Pattern = require('./pattern');

/**
 * A pattern that randomly yields a random value from a list of values.
 */
class Random extends Pattern {

  *[Symbol.iterator]() {
    let values = this.values;
    while (true) {
      let value = values[Math.floor(Math.random() * values.length)];
      value instanceof Pattern ? yield *value : yield value;
    }
  }

}

module.exports = Random;
