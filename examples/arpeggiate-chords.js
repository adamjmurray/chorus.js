require('../src/model').into(global);
const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');
const Scale = require('../src/model/scale');

const scheduler = new Scheduler();
const output = new MIDIOut({ defaultDuration: 200 });
const scale = new Scale(C, MAJOR);
const chordsAndSteps = [
  [TRIAD, 0],
  [INV1, 0],
  [INV2, 0],
  [SEVENTH_INV2, 1],
];

chordsAndSteps.forEach(([chord, scaleStep], chordIndex) => {
  [0,1,2,3,2,1].forEach((arpStep, arpIndex) => {
    scheduler.at((arpIndex + chordIndex*6) * 250,ms => output.note(chord.pitch(scale, scaleStep, arpStep)))
  })
});

output.open();
scheduler.start();
