const assert = require('assert');
const model = require('../../src/model');

describe('Model', () => {

  describe('pitches', () => {
    it('has immutable keys', () => {
      model.pitches.newPitch = true;
      assert.equal(model.pitches.newPitch, null);
    });

    it('has immutable properties', () => {
      model.pitches.C4.octave = 0;
      assert.equal(model.pitches.C4.octave, 4);
      model.pitches.C4.pitchClass.name = 'D';
      assert.equal(model.pitches.C4.pitchClass.name, 'C');
    });
  });
});