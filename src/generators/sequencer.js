class Sequencer {

  constructor(iterablesByName={}, { length, looped }) {
    this.iterablesByName = iterablesByName;
    this.length = length;
    this.looped = looped;
  }

  *[Symbol.iterator]() {
    const iterablesByName = this.iterablesByName;
    const names =  Object.keys(iterablesByName);
    const iterables = names.map(name => iterablesByName[name]);
    const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
    const isDones = iterators.map(() => false);
    let timeOffset = 0;
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
          if (name === 'time') timeOffset += this.length;
        }
        const value = nexts[i].value;
        if (value && value.constructor === Object) {
          for (const subname of Object.keys(value)) {
            result[subname] = value[subname];
            if (subname === 'time') result[subname] += timeOffset;
          }
        } else {
          result[name] = value;
          if (name === 'time') result[name] += timeOffset;
        }
      }
    } while (this.looped || isDones.includes(false));
  }
}

module.exports = Sequencer;