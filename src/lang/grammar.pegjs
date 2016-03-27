{
  const src = '../../../src';
  const PitchClass = require(`${src}/model/pitch-class`);
  const Duration = require(`${src}/model/duration`);
  const Intensity = require(`${src}/model/intensity`);
}

start
  = pitchClass / duration / intensity

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

