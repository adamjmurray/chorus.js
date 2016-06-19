const assert = require('assert');
const Model = require('../../src/model');

describe('Model', () => {

  describe('PITCH', () => {
    it('has immutable keys', () => {
      Model.PITCH.newPitch = true;
      assert.equal(Model.PITCH.newPitch, null);
    });

    it('has immutable properties', () => {
      Model.PITCH.C4.octave = 0;
      assert.equal(Model.PITCH.C4.octave, 4);
      Model.PITCH.C4.pitchClass.name = 'D';
      assert.equal(Model.PITCH.C4.pitchClass.name, 'C');
    });
  });
});