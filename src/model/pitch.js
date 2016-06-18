const PitchClass = require('./pitch-class');

class Pitch {
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

  get midiValue() {
    return (this.octave + 1) * 12 + this.pitchClass.value;
  }

  freeze() {
    this.pitchClass.freeze();
    return Object.freeze(this);
  }
}

module.exports = Pitch;
