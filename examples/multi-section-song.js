require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [
    {
      // length: 8, // determined automatically
      parts: [{
        rhythm: [1, 1, 1, 1, 1, 1, 1, 1],
        pitches: [C4, D4, E4, G4, F4, D4, A3, D4],
      }]
    },
    {
      length: 8,
      parts: [{
        rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        pitches: [G4, F4, D4, B3, C4, A3, G3, B3, C2, C6], // last 2 are ignored because it exceeds the section length
      }]
    },
    {
      parts: [{
        rhythm: [1],
        pitches: [C4],
      }]
    }
  ]
});

MidiOut.select().then(midiOut => midiOut.play(song));
