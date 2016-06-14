const assert = require('assert');
const parse = require('../../src/lang/parse');
const Duration = require('../../src/model/duration');
const Intensity = require('../../src/model/intensity');
const PitchClass = require('../../src/model/pitch-class');

describe('parse', () => {
  it('parses pitch classes', () => {
    assert.deepEqual(parse('C'), PitchClass.fromName('C'));
  });

  it('parses pitch classes with flats', () => {
    assert.deepEqual( parse('Gb'), PitchClass.fromName('Gb') );
  });

  it('parses pitch classes with sharps', () => {
    assert.deepEqual( parse('a#'), PitchClass.fromName('a#') );
  });

  it('parses durations', () => {
    assert.deepEqual( parse('1/3'), new Duration(1/3) );
  });

  it('parses intensities', () => {
    assert.deepEqual( parse('++'), Intensity.fromName('++') );
  });

  it('parses notes', () => {
    assert.deepEqual( parse('{D 1/2 -}'), [
      {
        duration: {
          value: 1/2,
        },
        intensity: {
          value: 0.6,
        },
        octave: 4,
        pitchClass: {
          name: 'D',
          value: 2,
        }
      }
    ]);
  });
});
