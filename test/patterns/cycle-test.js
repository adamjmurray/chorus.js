const assert = require('assert');
const Cycle = require('../../src/pattern/cycle');

describe('Cycle', () => {
  let values;
  let max;
  let cycle;

  beforeEach(() => {
    values = [1,2,3];
    max = 10;
    cycle = new Cycle(values, {max});
  });

  describe('constructor', () => {
    it('should take a list of values as the first argument', () => {
      assert.deepEqual(cycle.values, values);
    });

    it('should take a "max" option in the second argument', () => {
      assert.equal(cycle.max, max);
    });

    it('should default the "max" option to 4 * cycle length', () => {
      cycle = new Cycle(values);
      assert.equal(cycle.max, 4 * values.length);
    });
  });

  describe('.iterator()', () => {
    it('repeatedly outputs the values given to the constructor until the max is reached', () => {
      let iter = cycle.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert(iter.next().done);
    });

    it('resets when called again', () => {
      let iter = cycle.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      iter = cycle.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert(iter.next().done);
    });

    it('supports nested patterns', () => {
      let cycle1 = new Cycle([1,2,3], {max: 5});
      let cycle2 = new Cycle([4,5], {max: 5});
      // NOTE: the max for the 'meta cycle' only counts a delegated yield* as 1 item.
      let cycle3 = new Cycle([cycle1, cycle2], {max: 4});
      assert.deepEqual([...cycle3], [1,2,3,1,2,4,5,4,5,4,1,2,3,1,2,4,5,4,5,4]);
    });
  });
});