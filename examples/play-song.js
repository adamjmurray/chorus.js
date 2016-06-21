require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song } = require('../src/model');

const song = new Song({
  bpm: 120,
  scale: HARMONIC_MINOR.at(C),
  chord_duration: 4,
  chords: [TRIAD.at(0), TRIAD.at(5), TRIAD.at(3), SEVENTH.at(4)], // wrap in a cycle? maybe sequencer does this automatically
});

const output = new MIDIOut({ defaultDuration: 1000 });
output.open();
output.play(song);


