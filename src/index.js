const { Harmony, Rhythm, Section, Song, Part } = require('./generators');
const { Chord, Pitch, PitchClass, Scale } = require('./models');
const { CHORDS, PITCH_CLASSES, PITCHES, SCALES } = require('./names');
// other submodules are optional

module.exports = {
  Harmony, Rhythm, Section, Song, Part,
  Chord, Pitch, PitchClass, Scale,
  CHORDS, PITCH_CLASSES, PITCHES, SCALES
};
