require('chorus/names').into(global);
const { Song, Output } = require('chorus');

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

Output.select().then(output => output.play(song));
