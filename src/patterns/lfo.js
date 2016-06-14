const Pattern = require('./pattern');

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
