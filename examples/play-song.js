require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song, Scale, Chord } = require('../src/model');

const song = new Song({
  bpm: 120,
  scale: new Scale(C, HARMONIC_MINOR),
  chord_duration: 4,
  chords: [
    new Chord(TRIAD, 0),
    new Chord(TRIAD, 5),
    new Chord(TRIAD, 3),
    new Chord(SEVENTH, 4)
  ], // wrap in a cycle? maybe sequencer does this automatically
});

const output = new MIDIOut({ defaultDuration: 1000 });
output.open();
output.play(song);


