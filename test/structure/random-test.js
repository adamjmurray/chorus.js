const assert = require('assert');
const { Random } = require('../../src');
const { take } = require('../../src/utils');

describe('Random', () => {

  describe('constructor()', () => {
    it("does nothing", () => {
      assert(new Random());
    });
  });

  describe('intensity()', () => {
    it("yields numbers between 0 (inclusive) and 1 (exclusive) by default", () => {
      for (const value of take(Random.intensity(), 100)) {
        assert(value >= 0 && value < 1)
      }
    });

    it("yields numbers between the given min (inclusive) and max (exclusive) by default", () => {
      for (const value of take(Random.intensity({min: 1, max: 2}), 100)) {
        assert(value >= 1 && value < 2)
      }
    });
  });

  describe('duration()', () => {
    it("yields integers between 1 (inclusive) and 4 (inclusive) by default", () => {
      assert.deepEqual([...new Set(take(Random.duration(), 500))].sort(), [1,2,3,4]);
    });

    it("yields integers between the given min and max (inclusive)", () => {
      assert.deepEqual([...new Set(take(Random.duration({ min: 4, max: 8 }), 500))].sort(), [4,5,6,7,8]);
    });

    it("yields integers between the given min and max (inclusive)", () => {
      assert.deepEqual(
        [...new Set(take(Random.duration({ min: 4, max: 8, multiplier: 1/4 }), 500))].sort(),
        [1, 5/4, 3/2, 7/4, 2]);
    });
  });

  describe('choice()', () => {
    it("randomly yields one of the given values", () => {
      assert.deepEqual([...new Set(take(Random.choice([1,5,9]), 100))].sort(), [1,5,9]);
    });
  });

  describe('weightedChoice()', () => {
    it("randomly yields one of the given values with the given weights", () => {
      const values= take(Random.weightedChoice([1,5,9], [2,0,1]), 500);
      assert.deepEqual([...new Set(values)].sort(), [1,9]);
      assert(values.filter(v => v===1).length > values.filter(v => v===9).length);
    });
  })
});
