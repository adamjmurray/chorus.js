const assert = require('assert');
const Feedback = require('../../src/pattern/feedback');

describe('Feedback', () => {
  let initial;
  let func;
  let feedback;

  beforeEach(() => {
    initial = 0;
    func = (input => input + 1);
    feedback = new Feedback(initial, func);
  });

  describe('constructor', () => {
    it('uses the first arg as the initial value (singular case)', () => {
      assert.deepEqual(feedback.values, initial);
    });

    it('uses the first arg as the initial value (multi case)', () => {
      assert.deepEqual(new Feedback([1,2,3]).values, [1,2,3]);
    });

    it('should take a function as the second argument', () => {
      assert.equal(feedback.func, func);
    });
  });

  describe('.iterator()', () => {
    it('executes the given feedback func on the initial value and then previous output', () => {
      let iter = feedback.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 4);
      assert.equal(iter.next().value, 5);
      assert.equal(iter.next().value, 6);
      assert.equal(iter.next().value, 7);
      assert.equal(iter.next().value, 8);
      assert.equal(iter.next().value, 9);
      assert.equal(iter.next().value, 10);
      // ad infinitum
    });

    it('should reset when called again', () => {
      let iter = feedback.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      iter = feedback.iterator();
      assert.equal(iter.next().value, 1);
      assert.equal(iter.next().value, 2);
      assert.equal(iter.next().value, 3);
      assert.equal(iter.next().value, 4);
      assert.equal(iter.next().value, 5);
      assert.equal(iter.next().value, 6);
      assert.equal(iter.next().value, 7);
      assert.equal(iter.next().value, 8);
      assert.equal(iter.next().value, 9);
      assert.equal(iter.next().value, 10);
      // ad infinitum
    });

    it('works with array arguments', () => {
      let fibonacci = new Feedback([1,1], ([x,y]) => [y,x+y]);
      let iter = fibonacci.iterator();
      assert.deepEqual(iter.next().value, [1,2]);
      assert.deepEqual(iter.next().value, [2,3]);
      assert.deepEqual(iter.next().value, [3,5]);
      assert.deepEqual(iter.next().value, [5,8]);
      assert.deepEqual(iter.next().value, [8,13]);
    });
  });
});