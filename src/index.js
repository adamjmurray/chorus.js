const { Chord, Pitch, PitchClass, RelativePitch, Scale } = require('./model');
const { CHORDS, PITCH_CLASSES, PITCHES, SCALES } = require('./names');
const { Harmony, Random, Rhythm, Section, Song, Part } = require('./structure');
// other submodules are optional

/**
 * @module chorus
 * @description
 * #### The top-level module for chorus.js, which exports all public classes in the [model](./module-model.html), [names](./module-names.html), and [structure](./module-structure.html) modules.
 *
 * NOTE: The [midi](./module-midi.html) module is not exported by this module because it requires optional native dependencies.
 */
module.exports = {
  Chord, Pitch, PitchClass, RelativePitch, Scale,
  CHORDS, PITCH_CLASSES, PITCHES, SCALES,
  Harmony, Random, Rhythm, Section, Song, Part,
};
