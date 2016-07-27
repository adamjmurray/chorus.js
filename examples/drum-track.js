require('../src/names').into(global);
const selectOutput = require('./helpers/select-output');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    tracks: [{
      rate: 1/2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pitches: [C2], // TODO: make this the default if no pitches are given? support pitch (singular) property?
    }]
  }]
});

selectOutput().then(output => output.play(song));
