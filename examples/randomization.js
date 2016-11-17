require('../src/names').into(global);
const { Song, Random } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: DORIAN(C),
    length: 20,
    harmony: {
      chords: [TRIAD(0), TRIAD(3), TRIAD(1), TRIAD(4), TRIAD(0)],
      durations: [4],
    },
    parts: [{
      mode: 'arpeggio',
      pitches: [0, Random.pitch(), -1, Random.pitch({ min: 1, max: 4 })],
      rhythm: {
        pattern: [1/4],
        intensities: [1, Random.intensity({ min: 0.2 }), Random.intensity({ min: 0.4 })],
        durations: [1/4, Random.duration({ min: 1, max: 8, multiplier: 1/16 })],
        looped: true,
      },
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
