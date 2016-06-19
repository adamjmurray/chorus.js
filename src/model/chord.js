const utils = require('../utils');

/**
 * A list of scale step intervals
 */
class Chord {

  constructor(relativeSteps) { // TODO: option for "borrowed" notes from the chromatic scale
    this.relativeSteps = relativeSteps;
  }

  pitches(scale, rootStep, relativeOctave = 0) {
    return this.relativeSteps.map(step => scale.pitch(rootStep + step, relativeOctave));
  }

  pitch(scale, rootStep, relativeStep, relativeOctave = 0) {
    const pitches = this.pitches(scale, rootStep, relativeOctave);
    const pitch = pitches[utils.mod(relativeStep, pitches.length)];
    const offset = Math.floor(relativeStep / pitches.length);
    if (offset !== 0) {
      return pitch.add(offset * scale.semitones);
    }
    return pitch;
  }

  inversion(scale, number) {
    const steps = this.relativeSteps.slice(); // make a copy
    for (let i =  1; i <= number; i++) steps.push(steps.shift() + scale.length);
    for (let i = -1; i >= number; i--) steps.unshift(steps.pop() - scale.length);
    return new Chord(steps);
  }

  freeze() {
    return Object.freeze(this);
  }
}

module.exports = Chord;
