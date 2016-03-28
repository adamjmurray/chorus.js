'use strict';
const PitchClass = require('./pitch-class');
const Duration = require('./duration');
const Intensity = require('./intensity');

module.exports = class Note {
  constructor(pitchClass, octave, duration, intensity) {
    this.pitchClass = pitchClass || 0;
    this.octave = octave != null ? octave : 4;
    this.duration = duration != null ? duration : 1;
    this.intensity = intensity != null ? intensity : 0.7;
  }

  // TODO: this probably needs to be extracted into an interpreter class
  static fromProperties(props) {
    const pitchClasses = [];
    const octaves = [];
    const durations = [];
    const intensities = [];
    for (const prop of props) {
      if (prop instanceof PitchClass) pitchClasses.push(prop);
      // TODO octaves
      else if (prop instanceof Duration) durations.push(prop);
      else if (prop instanceof Intensity) intensities.push(prop);
      // TODO: other notes
    }
    return pitchClasses.map(pc => new Note(pc, octaves.shift(), durations.shift(), intensities.shift()));
  }
};
