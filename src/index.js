const { Harmony, Random, Rhythm, Section, Song, Part } = require('./structure');
const { Chord, Pitch, PitchClass, Scale } = require('./models');
const { CHORDS, PITCH_CLASSES, PITCHES, SCALES } = require('./names');
// other submodules are optional

/**
 * @module chorus
 * @description #### The top-level module for chorus.js, which exports all the classes exported by the [Structure](./module-Structure.html), [Models](./module-Models.html), and [Names](./module-Names.html) modules.
 *
 * NOTE: Because it requires native dependencies, the [MIDI](./module-MIDI.html) module is not exported by default here.
 */
module.exports = {
  Harmony, Random, Rhythm, Section, Song, Part,
  Chord, Pitch, PitchClass, Scale,
  CHORDS, PITCH_CLASSES, PITCHES, SCALES
};
