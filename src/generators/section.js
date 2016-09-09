const Track = require('./track');
const Harmony = require('./harmony');

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
    // TODO: we might need to start making all section duration explicit if we support auto-looping of rhythm or pitches. Also, rename to length?
  }

  *[Symbol.iterator]() {
    const { scale, harmony, tracks } = this;
    let trackIdx = -1;
    for (const track of tracks) {
      trackIdx++;
      const octave = track.octave;
      let harmonyIter = harmony[Symbol.iterator]();
      let harmonyCurr = harmonyIter.next();
      let harmonyNext = harmonyIter.next();
      for (const event of track) {
        const channel = track.channel || (trackIdx + 1);
        const mode = track.mode;
        let { time, pitch, duration, intensity } = event;
        if (time >= this.duration) {
          // exceeded section duration (we're assuming monotonically increasing times)
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
          }
        }
        const note = { pitch, duration, intensity, channel };
        yield { time, track: trackIdx, note }; // TODO: maybe the MIDI file track should be based on the channel
      }
    }
  }
}

module.exports = Section;
