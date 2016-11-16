require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'chromatic',
      rhythm: 'XxxxXxxxXxxxX===',
      pulse: 1/2,
      pitches: [4, 12, 11, 1, 3, 2, 7, 9, 8, 6, 10, 5, 0],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
