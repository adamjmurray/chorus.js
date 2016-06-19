const assert = require('assert');
const List = require('../../src/patterns/list');

describe('List', () => {
  let values;
  let list;

  beforeEach(() => {
    values = [1,2,3];
    list = new List(values);
  });

  describe('constructor', () => {
    it('takes a list of values as the first argument', () => {
      assert.deepEqual(list.values, values);
    });
  });

  describe('iterator()', () => {
    it('returns an iter over the values given to the constructor', () => {
      let iter = list.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert(iter.next().done);
    });

    it('flattens singly-nested lists', () => {
      let metaList = new List([0,list,0]);
      let iter = metaList.iterator();
      assert.equal(iter.next().value, 0);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 0);
      assert(iter.next().done);
    });

    it('flattens nested lists', () => {
      let s1 = new List([0,list,0]);
      let s2 = new List([1,2,3]);
      let s3 = new List([s1,-1,s2]);
      let iter = s3.iterator();
      assert.equal(iter.next().value, 0);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 0);
      assert.equal(iter.next().value, -1);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert(iter.next().done);
    });

    it('allows for the same sublist to be reused', () => {
      let metaList = new List([list,list]);
      let iter = metaList.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert(iter.next().done);
    });

    it('resets when called again', () => {
      let iter = list.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      iter = list.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert(iter.next().done);
    });

    it('allows concurrent iteration', () => {
      let iter1 = list.iterator();
      let iter2 = list.iterator();
      assert.equal(iter1.next().value, 1);
      assert.equal(iter2.next().value, 1);
      assert.equal(iter1.next().value, 2);
      assert.equal(iter2.next().value, 2);
      assert.equal(iter1.next().value, 3);
      assert.equal(iter2.next().value, 3);
      assert(iter1.next().done);
      assert(iter2.next().done);
    });

    it('works in for-of loops', () => {
      let results = [];
      for (let value of list) {
        results.push(value);
      }
      assert.deepEqual(results, values);
    });

    it('works with the spread operator', () => {
      let results = [...list];
      assert.deepEqual(results, values);
    });
  });
});
