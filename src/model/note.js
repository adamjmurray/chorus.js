const Pitch = require('./pitch');
const { clamp, clampInt } = require('../utils');

/**
 * A musical event defined in terms of {@link Pitch}, {@link Duration}, and {@link Intensity}.
 */
class Note {

  /**
   * @param {Object} properties
   * @param {Pitch} [properties.pitch=new Pitch('C4')]
   * @param {Duration} [properties.duration=new Duration(1)]
   * @param {Intensity} [properties.intensity=new Intensity(0.7)]
   */
  constructor(
    { pitch = new Pitch(60),
      duration = 1,
      intensity = 0.7,
      channel} = {}) {
    // console.log('in note constructor', pitch);
    this.pitch = pitch;
    this.duration = duration;
    this.intensity = intensity;
    if (channel) this.channel = channel;
  }

  static fromProperties(property) {
    // console.log('in note from properties', property);
    const pitches = [];
    const durations = [];
    const intensities = [];
    for (const prop of property) {
      if (prop instanceof Pitch) pitches.push(prop);
      else if (prop instanceof Duration) durations.push(prop);
      else if (prop instanceof Intensity) intensities.push(prop);
    }
    return pitches.map(pitch => new Note({
      pitch,
      duration: durations.shift(),
      intensity: intensities.shift()
    }));
  }

  toJSON() {
    let {pitch, duration, intensity, channel} = this;
    return {
      type: 'note',
      pitch: clampInt(pitch, 0, 127),
      velocity: clampInt(intensity*127, 0, 127),
      duration: clamp(duration, 0),
      release: 100,
      channel: clamp(channel, 1, 16),
    }
  }
}

module.exports = Note;
