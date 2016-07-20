const { Harmony, Rhythm, Section, Song, Track } = require('./generators');
const { Chord, Note, Pitch, PitchClass, Scale } = require('./model');
const { CHORDS, PITCH_CLASSES, PITCHES, SCALES } = require('./names');
// other submodules are optional

module.exports = {
  Harmony, Rhythm, Section, Song, Track,
  Chord, Note, Pitch, PitchClass, Scale,
  CHORDS, PITCH_CLASSES, PITCHES, SCALES
};
