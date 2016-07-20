const Track = require('./track');
const Harmony = require('./harmony');
const {Pitch, Note} = require('../model');

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
    this.duration = duration;
    // TODO: option to have the harmony and tracks loop or be "one-shot"
  }

  *[Symbol.iterator]() {
    const { scale } = this;
    const harmonySequence = [...this.harmony];
    let trackIdx = -1;
    for (const track of this.tracks) {
      trackIdx++;
      const octave = track.octave;
      for (const event of track) {
        const channel = track.channel || (trackIdx + 1);
        const mode = track.mode;
        const {time, duration, intensity} = event;
        let pitch;
        if (event.pitch instanceof Pitch) {
          pitch = event.pitch;
        }
        else if (typeof event.pitch === 'number') {
          const number = event.pitch;
          let chord;
          switch (mode) {
            case 'arpeggio':
              chord = chordAt(harmonySequence, time); // only need to do this for arpeggio and chord modes
              pitch = chord.pitch(number, { scale, octave });
              break;
            case 'chord':
              pitch = null;
              chord = chordAt(harmonySequence, time); // only need to do this for arpeggio and chord modes
              const pitches = chord.pitches({ scale, octave, inversion: number });
              for (const p of pitches) {
                const note = { pitch: p, duration, intensity, channel };
                yield { time, track: trackIdx, note };
              }
              break;
            case 'scale':
              pitch = scale.pitch(number, { octave });
              break;
            case 'chromatic':
              pitch = scale.pitch(0, { octave }).add(number);
              break;
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
