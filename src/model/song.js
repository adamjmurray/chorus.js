const Scheduler = require('../time/scheduler');

class Song {

  constructor({
    bpm = 120,
    scale,
    chord_duration = 4, // 1 measure in 4/4, this might be simpler for people who don't know music theory?
    chords
    // rhythm: [3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 1, 3, 2], // something like this for track rhythms?
  } = {}) {
    this.bpm = bpm;
    this.scale = scale;
    this.chord_duration = chord_duration;
    this.chords = chords;
  }

  play(output) {
    var scheduler = new Scheduler({ bpm: this.bpm });
    this.chords.forEach((chord, index) => {
      chord.scale = this.scale;
      scheduler.at(index * this.chord_duration, () => {
        chord.pitches().forEach(pitch => output.note(pitch))
      });
    });
    scheduler.start();
    return scheduler; // so the caller can stop it if desired
  }
}

module.exports = Song;
