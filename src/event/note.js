const PitchClass = require('./pitch-class');
const Duration = require('./duration');
const Intensity = require('./intensity');
const { clamp } = require('../utils');

class Note {
  constructor(
    { pitchClass = new PitchClass(0),
      octave = 4,
      duration = new Duration(1),
      intensity = new Intensity(0.7) } = {}) {
    this.pitchClass = pitchClass;
    this.octave = octave;
    this.duration = duration;
    this.intensity = intensity;
  }

  // TODO: this should become the constructor for Chords?
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
      // TODO: other Notes
    }
    return pitchClasses.map(pitchClass => new Note({
      pitchClass,
      octave: octaves.shift(),
      duration: durations.shift(),
      intensity: intensities.shift()
    }));
  }

  midiJSON() {
    return {
      type: 'note',
      pitch: clamp(12 * (this.octave + 2) + this.pitchClass.value, 0, 127),
      velocity: clamp(this.intensity.value * 127, 0, 127),
      duration: clamp(this.duration.value, 0),
      release: 100,
      channel: 1
    }
  }
}

module.exports = Note;
