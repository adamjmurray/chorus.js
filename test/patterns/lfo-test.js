const assert = require('assert');
const LFO = require('../../src/pattern/lfo');

describe('LFO', () => {
  let lfo;
  let sine = (t) => Math.sin(t);

  beforeEach(() => {
    lfo = new LFO(sine);
  });

  describe('iterator()', () => {
    it('evaluates the given func for incrementing values', () => {
      let iter = lfo.iterator();
      assert.equal(iter.next().value, Math.sin(0));
      assert.equal(iter.next().value, Math.sin(1));
      assert.equal(iter.next().value, Math.sin(2));
      assert.equal(iter.next().value, Math.sin(3));
      assert.equal(iter.next().value, Math.sin(4));
    });

    it('takes a speed option', () => {
      let lfo = new LFO(sine, {speed: 1/100});
      let iter = lfo.iterator();
      assert.equal(iter.next().value, Math.sin(0));
      assert.equal(iter.next().value, Math.sin(1/100));
      assert.equal(iter.next().value, Math.sin(2/100));
      assert.equal(iter.next().value, Math.sin(3/100));
      assert.equal(iter.next().value, Math.sin(4/100));
    });

    it('takes an offset option', () => {
      let lfo = new LFO(sine, {offset: 2});
      let iter = lfo.iterator();
      assert.equal(iter.next().value, Math.sin(2));
      assert.equal(iter.next().value, Math.sin(3));
      assert.equal(iter.next().value, Math.sin(4));
    });
  });
});
