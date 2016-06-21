const Chord = require('./chord');
const Duration = require('./duration');
const Intensity = require('./intensity');
const Note = require('./note');
const Pitch = require('./pitch');
const PitchClass = require('./pitch-class');
const Scale = require('./scale');
const Song = require('./song');

/**
 * @module Model
 */
module.exports = {

  /** @member {Chord} Chord the Chord class */
  Chord,

  /** @member {Duration} Duration the Duration class */
  Duration,

  /** @member {Intensity} Intensity the Intensity class */
  Intensity,

  /** @member {Note} Note the Note class */
  Note,

  /** @member {Pitch} Pitch the Pitch class */
  Pitch,

  /** @member {PitchClass} PitchClass the PitchClass class */
  PitchClass,

  /** @member {Scale} Scale the Scale class */
  Scale,

  Song,
};
