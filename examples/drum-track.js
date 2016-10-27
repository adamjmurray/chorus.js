require('../src/names').into(global);
const selectOutput = require('./helpers/select-output');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    parts: [{
      rate: 1/2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pitches: [KICK],
    }]
  }]
});

selectOutput().then(output => output.play(song));
