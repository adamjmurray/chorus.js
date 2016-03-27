const expect = require('chai').expect;
const parse = require('../../src/lang/parse');
const Duration = require('../../src/model/duration');
const Intensity = require('../../src/model/intensity');
const PitchClass = require('../../src/model/pitch-class');

describe('parse', () => {
  it('parses pitch classes', () => {
    expect(parse('C')).to.deep.equal(PitchClass.fromName('C'));
  });

  it('parses pitch classes with flats', () => {
    expect( parse('Gb') ).to.deep.equal( PitchClass.fromName('Gb') );
  });

  it('parses pitch classes with sharps', () => {
    expect( parse('a#') ).to.deep.equal( PitchClass.fromName('a#') );
  });

  it('parses durations', () => {
    expect( parse('1/3') ).to.deep.equal( new Duration(1/3) );
  });

  it('parses intensities', () => {
    expect( parse('++') ).to.deep.equal( Intensity.fromName('++') );
  });
});
