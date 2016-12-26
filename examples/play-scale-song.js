require('../src/names').into(global);
const { Song, Output } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pulse: 1/2,
      rhythm: 'XxXxXxxXxxXxXxX===',
      pitches: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0],
    }]
  }]
});

Output.select().then(output => output.play(song));
