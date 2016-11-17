/**
 * Generic sequencing logic *intended for internal use*.
 *
 * The superclass of {@link Rhythm}, {@link Harmony}, and {@link Part}.
 */
class Sequencer {

  /**
   *
   * @param {Object} iterablesByName the property names and iterables used by @@iterator()
   * @param {Object} options see subclass documentation
   */
  constructor(iterablesByName={}, { length, looped=false, delay=0 }={}) {
    this.iterablesByName = iterablesByName;
    this.length = length;
    this.looped = looped;
    this.delay = delay;
  }

  /**
   * @function @@iterator
   * @memberOf Sequencer
   * @instance
   * @description The `[Symbol.iterator]()` generator function* that implements the
   *              [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols|MDN: Iteration Protocols}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator|MDN: Symbol.iterator}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*|MDN: function*}
   */
  *[Symbol.iterator]() {
    const iterablesByName = this.iterablesByName;
    const names =  Object.keys(iterablesByName);
    const iterables = names.map(name => iterablesByName[name]);
    const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
    const isDones = iterators.map(() => false);
    let timeOffset = this.delay;
    let result;
    do {
      if (result) yield result;
      const nexts = iterators.map(iterator => iterator.next());
      result = {};
      for (let i = 0; i < nexts.length; i++) {
        const name = names[i];
        if (nexts[i].done) {
          isDones[i] = true;
          iterators[i] = iterables[i][Symbol.iterator]();
          nexts[i] = iterators[i].next();
          if (nexts[i].done) return; // empty iterator, give up
          if (name === 'time') timeOffset += this.length;
        }
        let value = nexts[i].value;
        if (value && value.constructor === Object) {
          for (const subname of Object.keys(value)) {
            result[subname] = value[subname];
            if (subname === 'time') result[subname] += timeOffset;
          }
        } else {
          if (value && value.next instanceof Function) { // nested Iterator (such as a Random generator function)
            value = value.next().value;
          }
          result[name] = value;
          if (name === 'time') result[name] += timeOffset;
        }
      }
    } while (this.looped || isDones.includes(false));
  }
}

module.exports = Sequencer;