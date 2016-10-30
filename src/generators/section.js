const Part = require('./part');
const Harmony = require('./harmony');

/**
 * A Song section
 */
class Section {

  constructor({scale, harmony, parts=[], length} = {}) {
    this.scale = scale;
    this.harmony = harmony instanceof Harmony ? harmony : new Harmony(harmony);
    this.parts = parts.map(t => t instanceof Part ? t : new Part(t));
    this.length = length || Math.max(...this.parts.map(t => t.length));
  }

  *[Symbol.iterator]() {
    const { scale, harmony, parts } = this;
    let partIdx = -1;
    for (const part of parts) { // can't use forEach because we're in a generator
      partIdx++;
      const octave = part.octave;
      const channel = part.channel || (partIdx + 1);
      const partMode = part.mode;
      let harmonyIter = harmony[Symbol.iterator]();
      let harmonyCurr = harmonyIter.next();
      let harmonyNext = harmonyIter.next();
      for (const event of part) {
        let { time, pitch, duration, intensity } = event;
        if (time >= this.length) {
          // exceeded section length (we're assuming monotonically increasing times)
          break;
        }
        while (harmonyNext && harmonyNext.value && harmonyNext.value.time <= time) {
          harmonyCurr = harmonyNext;
          harmonyNext = harmonyIter.next();
        }
        let { value:{chord}={} } = harmonyCurr || {};

        if (partMode && typeof pitch === 'number') {
          const number = pitch;
          // let chord;
          switch (partMode) {
            case 'arpeggio': {
              pitch = chord.pitch(number, { scale, octave });
              break;
            }
            case 'bass': {
              pitch = chord.pitch(0, { scale, octave, inversion: 0, offset: number });
              break;
            }
            case 'lead': {
              pitch = chord.pitch(0, { scale, octave, offset: number });
              break;
            }
            case 'chord': {
              pitch = null;
              const pitches = chord.pitches({ scale, octave, inversion: chord.inversion + number });
              for (const p of pitches) {
                const note = { pitch: p, duration, intensity, channel };
                yield { time, part: partIdx, note };  // TODO: maybe the MIDI file part should be based on the channel
              }
              break;
            }
            case 'scale': {
              pitch = scale.pitch(number, { octave });
              break;
            }
            case 'chromatic': {
              pitch = scale.pitch(0, { octave }).add(number);
              break;
            }
            default: {
              console.error(`Unsupported part mode "${partMode}"`);
            }
          }
        }
        if (pitch) {
          const note = { pitch, duration, intensity, channel };
          yield { time, part: partIdx, note }; // TODO: maybe the MIDI file part should be based on the channel
        }
      }
    }
  }
}

module.exports = Section;
