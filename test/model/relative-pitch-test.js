const assert = require('assert');
const RelativePitch = require('../../model/relative-pitch');

describe('PitchClass', () => {

  describe('constructor()', () => {

    it('supports degree and shift as separate arguments', () => {
      const rp = new RelativePitch(1,2);
      assert.equal(rp.degree, 1);
      assert.equal(rp.shift, 2);
    });

    it('defaults shift to 0 when degree is a Number', () => {
      const rp = new RelativePitch(1);
      assert.equal(rp.degree, 1);
      assert.equal(rp.shift, 0);
    });

    it('supports a {degree,shift} Object as the argument', () => {
      const rp = new RelativePitch({ degree: 2, shift: -1 });
      assert.equal(rp.degree, 2);
      assert.equal(rp.shift, -1);
    });

    it('defaults shift to 0 with an Object argument', () => {
      const rp = new RelativePitch({ degree: 3 });
      assert.equal(rp.degree, 3);
      assert.equal(rp.shift, 0);
    });

    it('defaults degree to 0 with an Object argument', () => {
      const rp = new RelativePitch({ shift: 1 });
      assert.equal(rp.degree, 0);
      assert.equal(rp.shift, 1);
    });

    it('creates an immutable object', () => {
      let rp = new RelativePitch(1,2);
      rp.degree = 0;
      rp.shift = 0;
      assert.equal(rp.degree, 1);
      assert.equal(rp.shift, 2);
      rp = new RelativePitch({ degree: 1, shift: 2 });
      rp.degree = 0;
      rp.shift = 0;
      assert.equal(rp.degree, 1);
      assert.equal(rp.shift, 2);
    });
  });
});
