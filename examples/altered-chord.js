require('chorus/names').into(global);
const { Chord, Song, Output } = require('chorus');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      chords: [new Chord([{degree: 1, shift: -1}, 3, 5], {inversion: 1}), SEVENTH(4).inv(-2), TRIAD_PLUS_8(0)],
      durations: [2],
    },
    parts: [{
      mode: 'chord',
      rhythm: 'XXX=',
      pulse: 2,
      pitches: [0],
      octave: 3,
    }]
  }]
});

Output.select().then(output => output.play(song));
