require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 160,
  scale: HARMONIC_MINOR(C),
  sections: [
    {
      length: 16,
      harmony: {
        rate: 4,
        looped: true,
        chords: [TRIAD(0), TRIAD(-2)]
      },
      parts: [{
        looped: true,
        mode: 'arpeggio',
        rhythm: [1, 1.5, 1, 0.5],
        pitches: [0, 1, 2, 0],
      }]
    },
    {
      length: 16,
      harmony: {
        rate: 4,
        looped: true,
        chords: [TRIAD(-4), TRIAD(-3)]
      },
      parts: [{
        looped: true,
        mode: 'arpeggio',
        rhythm: [1, 1.5, 1, 0.5],
        pitches: [0, 1, 2, 0],
      }]
    },
    {
      parts: [{
        rhythm: [4],
        pitches: [C4],
      }]
    }
  ]
});

MidiOut.select().then(midiOut => midiOut.play(song));
