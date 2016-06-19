require('../src/names').into(global);
const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');
const { Scale, Chord } = require('../src/model');

const scheduler = new Scheduler();
const output = new MIDIOut({ defaultDuration: 200 });
const scale = new Scale(C, MAJOR);

[
  [TRIAD, 0],
  [INV1, 0],
  [INV2, 0],
  [SEVENTH_INV2, 1],
]
.forEach(([chordType, scaleDegree], chordIndex) => {
  const chord = new Chord(scale, scaleDegree, chordType);
  [0,1,2,3,2,1].forEach((arpPosition, arpIndex) => {
    const time = (arpIndex + chordIndex * 6) * 250;
    scheduler.at(time,ms => output.note(chord.pitch(arpPosition)))
  })
});

output.open();
scheduler.start();
