require('../src/names').into(global);
const selectOutput = require('../src/midi/select-output');
const { Song } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'chromatic',
      rate: 1/2,
      rhythm: 'XxxxXxxxXxxxX===',
      pitches: [4, 12, 11, 1, 3, 2, 7, 9, 8, 6, 10, 5, 0],
    }]
  }]
});

selectOutput().then(output => output.play(song));
