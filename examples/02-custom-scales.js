const { Song, Output, Scale, PITCH_CLASSES } = require('chorus');

const song = new Song({
  sections: [{
    scale: new Scale([2,2,1,2,2,2,1], PITCH_CLASSES.C),
    parts: [{
      mode: 'scale',
      pitches: [0, 1, 2, 3, 4, 5, 6, 7],
    }]
  }]
});

Output.select().then(output => output.play(song));
