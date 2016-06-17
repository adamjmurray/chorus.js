{
  const src = '../../../src';
  const Duration = require(`${src}/model/duration`);
  const Intensity = require(`${src}/model/intensity`);
  const Note = require(`${src}/model/note`);
  const PitchClass = require(`${src}/model/pitch-class`);
}

start
  = note / note_property

note
  = _ "{" props:note_property+ "}" _ { return Note.fromProperties(props); }

note_property
  = _ value:(pitchClass / duration / intensity) _ { return value; }

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