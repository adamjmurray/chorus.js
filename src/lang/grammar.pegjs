{
  const src = '../../../src';
  const { Chord, Duration, Intensity, Note, Pitch, PitchClass, Scale } = require(`${src}/model`);
}

start
  = note / note_property / pitchClass

note
  = _ "{" props:note_property+ "}" _ { return Note.fromProperties(props); }

note_property
  = _ value:(pitch / duration / intensity) _ { return value; }

pitch
  = pitchClass:pitchClass octave:integer { return new Pitch(pitchClass, octave); }

pitchClass
  = name:([A-Ga-g][#b]?) { return new PitchClass(name.join('')); }

duration
  = value:(rational / integer) { return new Duration(value); }

intensity
  = name:("+++" / "++" / "+" / "---" / "--" / "-") { return new Intensity(name); }

rational
  = numerator:integer "/" denominator:integer { return numerator/denominator; }

integer
  = digits:[0-9]+ { return parseInt(digits.join(''), 10); }

_ "whitespace"
  = [ \t\n]*