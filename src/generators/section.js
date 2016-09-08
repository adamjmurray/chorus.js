const Track = require('./track');
const Harmony = require('./harmony');
const { Pitch } = require('../models');

function chordAt(harmonySequence, time) {
  let i = 0;
  let h = harmonySequence[i];
  while (h && (h.time <= time)) h = harmonySequence[++i];
  const chord = harmonySequence[(i || 1) - 1].chord;
  return chord;
}

/**
 * A Song section
 */
class Section {

  constructor({scale, harmony, tracks=[], duration} = {}) {
    this.scale = scale;
    this.harmony = harmony instanceof Harmony ? harmony : new Harmony(harmony);
    this.tracks = tracks.map(t => t instanceof Track ? t : new Track(t));
    this.duration = duration || Math
                                .max(...this.tracks
                                  .map(t => t.duration)
                                  .filter(dur => isFinite(dur)));
  }

  *[Symbol.iterator]() {
    const { scale } = this;
    // const harmonySequence = [...this.harmony]; // TODO: this won't work with looped harmonies
    let trackIdx = -1;
    for (const track of this.tracks) {
      trackIdx++;
      const octave = track.octave;
      let harmonyIter = this.harmony[Symbol.iterator]();
      let harmonyCurr = harmonyIter.next();
      let harmonyNext = harmonyIter.next();
      for (const event of track) {
        const channel = track.channel || (trackIdx + 1);
        const mode = track.mode;
        const {time, duration, intensity} = event;
        if (time >= this.duration) {
          // exceeded section duration (we're assuming monotonically increasing times)
          break;
        }
        while (harmonyNext && harmonyNext.value && harmonyNext.value.time <= time) {
          harmonyCurr = harmonyNext;
          harmonyNext = harmonyIter.next();
        }
        let chord = harmonyCurr && harmonyCurr.value && harmonyCurr.value.chord;
        let pitch;
        if (event.pitch instanceof Pitch) {
          pitch = event.pitch;
        }
        // TODO: support pitch class?
        else if (typeof event.pitch === 'number') {
          const number = event.pitch;
          // let chord;
          switch (mode) {
            case 'arpeggio': {
              // chord = chordAt(harmonySequence, time); // only need to do this for arpeggio and chord modes
              pitch = chord.pitch(number, { scale, octave });
              break;
            }
            case 'chord': {
              pitch = null;
              // chord = chordAt(harmonySequence, time); // only need to do this for arpeggio and chord modes
              const pitches = chord.pitches({ scale, octave, inversion: number });
              for (const p of pitches) {
                const note = { pitch: p, duration, intensity, channel };
                yield { time, track: trackIdx, note };
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
          }
        }
        if (pitch) {
          const note = { pitch, duration, intensity, channel };
          yield { time, track: trackIdx, note };
        }
      }
    }
  }
}

module.exports = Section;
