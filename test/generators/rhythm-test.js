const assert = require('assert');
const { Rhythm } = require('../../src');

describe('Rhythm', () => {

  describe('distribute()', () => {
    it('generates euclidean rhythms', () => {
      assert.equal(Rhythm.distribute(5, 13), 'x..x..x.x..x.');
    });

    it('can optionally apply a rotation the resulting rhythm', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 1 }), 'x..x.x..x.x..');
    });

    it('can rotate more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 2 }), 'x.x..x.x..x..');
    });

    it('can rotate in reverse', () => {
      assert.equal(Rhythm.distribute(5, 13, {rotation: -1 }), 'x.x..x..x.x..');
    });

    it('can rotate in reverse more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: -2 }), 'x..x.x..x..x.');
    });

    it('generates continuous pulses when pulses == total', () => {
      assert.equal(Rhythm.distribute(10, 10), 'xxxxxxxxxx');
    });

    it('generates continuous pulses when pulses > total', () => {
      assert.equal(Rhythm.distribute(11, 10), 'xxxxxxxxxx');
      assert.equal(Rhythm.distribute(11, 10, { rotation: 1 }), 'xxxxxxxxxx');
      assert.equal(Rhythm.distribute(11, 10, { rotation: -1 }), 'xxxxxxxxxx');
    });

    it('generates no pulses when pulses is 0', () => {
      assert.equal(Rhythm.distribute(0, 10), '..........');
      assert.equal(Rhythm.distribute(0, 10, { rotation: 1 }), '..........');
      assert.equal(Rhythm.distribute(0, 10, { rotation: -1 }), '..........');
    });
  });
});
