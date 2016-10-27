const Track = require('./track');
const Harmony = require('./harmony');

/**
 * A Song section
 */
class Section {

  constructor({scale, harmony, tracks=[], length} = {}) {
    this.scale = scale;
    this.harmony = harmony instanceof Harmony ? harmony : new Harmony(harmony);
    this.tracks = tracks.map(t => t instanceof Track ? t : new Track(t));
    this.length = length || Math.max(...this.tracks.map(t => t.length));
  }

  *[Symbol.iterator]() {
    const { scale, harmony, tracks } = this;
    let trackIdx = -1;
    for (const track of tracks) { // can't use forEach because we're in a generator
      trackIdx++;
      const octave = track.octave;
      const channel = track.channel || (trackIdx + 1);
      const trackMode = track.mode;
      let harmonyIter = harmony[Symbol.iterator]();
      let harmonyCurr = harmonyIter.next();
      let harmonyNext = harmonyIter.next();
      for (const event of track) {
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
        if (typeof pitch === 'number') {
          const number = pitch;
          // let chord;
          switch (trackMode) {
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
                yield { time, track: trackIdx, note };  // TODO: maybe the MIDI file track should be based on the channel
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
              console.error(`Unsupported track mode "${trackMode}"`);
            }
          }
        }
        if (pitch) {
          const note = { pitch, duration, intensity, channel };
          yield { time, track: trackIdx, note }; // TODO: maybe the MIDI file track should be based on the channel
        }
      }
    }
  }
}

module.exports = Section;
