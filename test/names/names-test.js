const assert = require('assert');
const Names = require('../../src/names');

describe('Names', () => {

  describe('PITCHES', () => {
    it('has immutable keys', () => {
      Names.PITCHES.newPitch = true;
      assert.equal(Names.PITCHES.newPitch, null);
    });

    it('has immutable properties', () => {
      Names.PITCHES.C4.octave = 0;
      assert.equal(Names.PITCHES.C4.octave, 4);
      Names.PITCHES.C4.pitchClass.name = 'D';
      assert.equal(Names.PITCHES.C4.pitchClass.name, 'C');
    });
  });
});