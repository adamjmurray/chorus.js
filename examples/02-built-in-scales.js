const { Song, Output, SCALES, PITCH_CLASSES } = require('chorus');

const song = new Song({
  sections: [{
    scale: SCALES.MAJOR(PITCH_CLASSES.C),
    parts: [{
      mode: 'scale',
      pitches: [0, 1, 2, 3, 4, 5, 6, 7],
    }]
  }]
});

Output.select().then(output => output.play(song));
