// Same as index.js, but replaces Node.js-specific MIDI output code with just basic MIDI file support, and adds WebUtils
const { Chord, Pitch, PitchClass, RelativePitch, Scale } = require('../model');
const { CHORDS, PITCH_CLASSES, PITCHES, SCALES } = require('../names');
const { Harmony, Random, Rhythm, Section, Song, Part } = require('../structure');
const MidiFileParser = require('../midi/file/parser');
const MidiFileSerializer = require('../midi/file/serializer');
const WebUtils = require('./web-utils');

module.exports = {
  Chord, Pitch, PitchClass, RelativePitch, Scale,
  CHORDS, PITCH_CLASSES, PITCHES, SCALES,
  Harmony, Random, Rhythm, Section, Song, Part,
  MidiFileParser, MidiFileSerializer, WebUtils,
};
