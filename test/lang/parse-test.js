const assert = require('assert');
const parse = require('../../src/lang/parse');
const { Duration, Intensity, Pitch, PitchClass } = require('../../src/model');

describe('parse', () => {
  it('parses pitch classes', () => {
    assert.deepEqual(parse('C'), new PitchClass('C'));
  });

  it('parses pitch classes with flats', () => {
    assert.deepEqual( parse('Gb'), new PitchClass('Gb') );
  });

  it('parses pitch classes with sharps', () => {
    assert.deepEqual( parse('a#'), new PitchClass('a#') );
  });

  it('parses pitches', () => {
    assert.deepEqual( parse('Db5'), new Pitch('Db5'));
  });

  it('parses durations', () => {
    assert.deepEqual( parse('1/3'), new Duration(1/3) );
  });

  it('parses intensities', () => {
    assert.deepEqual( parse('++'), new Intensity('++') );
  });

  it('parses notes', () => {
    assert.deepEqual( parse('{D4 1/2 -}'), [
      {
        pitch: { value: 62 },
        duration: { value: 1/2 },
        intensity: { value: 0.6 },
      }
    ]);
  });
});
