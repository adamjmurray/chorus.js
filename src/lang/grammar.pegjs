{
  const src = '../../../src';
  const PitchClass = require(`${src}/model/pitch-class`);
  const Duration = require(`${src}/model/duration`);
  const Intensity = require(`${src}/model/intensity`);
}

start
  = note / note_property

note
  = _ "{" props:note_property+ "}" _ { return props; }

note_property
  = _ value:(pitchClass / duration / intensity) _ { return value; }

pitchClass
  = name:([A-Ga-g][#b]?) { return PitchClass.fromName(name.join('')); }

duration
  = value:(rational / integer) { return new Duration(value); }

intensity
  = name:("+++" / "++" / "+" / "---" / "--" / "-") { return Intensity.fromName(name); }

rational
  = numerator:integer "/" denominator:integer { return numerator/denominator; }

integer
  = digits:[0-9]+ { return parseInt(digits.join(''), 10); }

_ "whitespace"
  = [ \t\n]*