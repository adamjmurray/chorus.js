require('chorus/names').into(global);
const { Song, Output } = require('chorus');

const song = new Song({
  bpm: 160,
  scale: HARMONIC_MINOR(C),
  sections: [
    {
      length: 16,
      harmony: {
        looped: true,
        chords: [TRIAD(0), TRIAD(-2)],
        durations: [4],
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
        looped: true,
        chords: [TRIAD(-4), TRIAD(-3)],
        durations: [4],
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

Output.select().then(output => output.play(song));
