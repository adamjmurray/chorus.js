const Scheduler = require('../time/scheduler');
const Track = require('./track');
const Harmony = require('./harmony');

/**
 * A Song
 */
class Song {

  constructor({bpm=120, harmony, tracks=[]} = {}) {
    this.bpm = bpm;
    this.harmony = harmony instanceof Harmony ? harmony : new Harmony(harmony);
    this.tracks = tracks.map(t => t instanceof Track ? t : new Track(t));
  }

  play(output) {
    var scheduler = new Scheduler({ bpm: this.bpm });
    /*
    // Play the chord progression: TODO: a track type/mode to support this
    for (const event of this.harmony) {
      scheduler.at(event.time, () => {
        event.chord.pitches().forEach(pitch => output.note(pitch));
      })
    }
    */
    // TODO: move this logic into the Section class, make a Song consist of multiple sections
    // TODO: rework this into a generator function. Make the scheduler be able to play the Song iterator
    const harmony = [...this.harmony];
    // console.log('harmony:', harmony);
    for (const track of this.tracks) {
      for (const event of track) {
        // console.log(event);
        const time = event.time;
        let i = 0;
        let h = harmony[i];
        while (h && (h.time <= time)) h = harmony[++i];
        const chord = harmony[(i || 1) - 1].chord;
        // console.log(chord);
        scheduler.at(event.time, () => {
          output.note(chord.pitch(event.pitch), event.intensity * 127, event.duration * 60000/this.bpm);
        })
      }
    }
    scheduler.start();
    return scheduler; // so the caller can stop it if desired
  }
}

module.exports = Song;
