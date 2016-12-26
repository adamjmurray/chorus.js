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

    it('goes from the lowest to highest MIDI pitch using "scientific pitch notation"', () => {
      assert.equal(Names.PITCHES.C_1.valueOf(), 0);
      assert.equal(Names.PITCHES.G9.valueOf(), 127);
    });
  });

  describe('.into()', () => {
    it('injects the name constants into the given object', () => {
      const obj = { property: 'value', C: 'overwritten' };
      Names.into(obj);
      assert.equal(obj.property, 'value');
      assert.equal(obj.C, Names.PITCH_CLASSES.C);
      for (const namespace of ['PITCH_CLASSES', 'PITCHES', 'SCALES', 'CHORDS', 'DRUMS']) {
        for (const name of Object.keys(Names[namespace])) {
          assert.equal(obj[name], Names[namespace][name]);
        }
      }
    });
  });
});