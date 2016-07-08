const Track = require('./track');
const Harmony = require('./harmony');
const Note = require('../model/note');

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
    /*
     // Play the chord progression: TODO: a track type/mode to support this
     for (const event of this.harmony) {
     scheduler.at(event.time, () => {
     event.chord.pitches().forEach(pitch => output.note(pitch));
     })
     }
     */
    const { scale } = this;
    const harmony = [...this.harmony];
    // console.log('harmony:', harmony);
    let trackIdx = -1;
    for (const track of this.tracks) {
      trackIdx++;
      for (const event of track) {
        const {time, duration, intensity} = event;
        let i = 0;
        let h = harmony[i];
        while (h && (h.time <= time)) h = harmony[++i];
        const chord = harmony[(i || 1) - 1].chord;
        // console.log(chord);
        const pitch = chord.pitch(event.pitch, { scale }); // TODO: only do this if it's a number
        const channel = track.channel || trackIdx;
        const note = new Note({pitch, duration, intensity, channel});
        yield {time, track: trackIdx, note};
      }
    }
  }
}

module.exports = Section;
