const assert = require('assert');
const Random = require('../../src/patterns/random');
const List = require('../../src/patterns/list');

describe('Random', () => {
  let values;
  let random;

  beforeEach(() => {
    values = [1,2,3,4,5];
    random = new Random(values);
  });

  describe('constructor', () => {
    it('should take a list of values as the first argument', () => {
      assert.deepEqual(random.values, values);
    });
  });

  describe('.iterator()', () => {
    it('outputs random values', () => {
      let iter = random.iterator();
      let results = {};
      for (let i=0; i<1000; i++) {
        results[iter.next().value] = 0;
      }
      assert.deepEqual(Object.keys(results).sort(), [1,2,3,4,5]);
    });

    it('works with sub-patterns', () => {
      let random = new Random([ new List([1,2]), new List([3,4]) ]);
      let iter = random.iterator();
      let results = [];
      let prev;
      for (let i=0; i<1000; i++) {
        results.push( iter.next().value );
      }
      for (let value of results) {
        if (prev == 1) assert.equal(value, 2);
        if (prev == 3) assert.equal(value, 4);
        prev = value;
      }
    })
  });
});