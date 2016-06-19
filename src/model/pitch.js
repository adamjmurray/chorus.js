const PitchClass = require('./pitch-class');

class Pitch {
  static get MAX_VALUE() {
    return 128;
  }

  constructor(pitchClass, octave = 4) {
    if (typeof pitchClass === 'number') {
      const midiValue = pitchClass;
      if (!(midiValue >= 0 && midiValue <= 127)) throw new RangeError('midi pitch must be from 0 to 127');
      this.pitchClass = new PitchClass(Math.round(midiValue) % 12);
      this.octave = Math.floor(midiValue / 12) - 1;
    }
    else {
      this.pitchClass = pitchClass;
      this.octave = octave;
    }
  }

  get value() {
    return (this.octave + 1) * 12 + this.pitchClass.value;
  }

  get midiValue() {
    return this.value;
  }

  add(semitones) {
    return new Pitch(this.value + semitones);
  }

  freeze() {
    this.pitchClass.freeze();
    return Object.freeze(this);
  }
}

module.exports = Pitch;
