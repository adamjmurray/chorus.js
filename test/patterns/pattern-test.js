const assert = require('assert');
const Pattern = require('../../src/patterns/pattern');

describe('Pattern', () => {
  let values;
  let seq;

  beforeEach(() => {
    values = [1,2,3];
    seq = new Pattern(values);
  });

  describe('constructor', () => {
    it('take a list of values as the first argument', () => {
      assert.deepEqual(seq.values, values);
    });
  });

  describe('.iterator()', () => {
    it('returns all the values given to the constructor and then is done (subclasses provide other iteration patterns)', () => {
      let iter = seq.iterator();
      assert.deepEqual(iter.next().value, values);
      assert(iter.next().done);
    });

    it('works with for-of', () => {
      let results = [];
      for (let value of seq) {
        results.push(value);
      }
      assert.deepEqual(results, [values]);
    });

    it('works with the spread operator', () => {
      let results = [...seq];
      assert.deepEqual(results, [values]);
    });
  });
});
