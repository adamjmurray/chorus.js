require('../src/names').into(global);
const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');
const { Scale, Chord } = require('../src/model');

const scheduler = new Scheduler({ bpm: 120 });
const output = new MIDIOut({ defaultDuration: 200 });
const scale = new Scale(C, MAJOR);

[
  [TRIAD, 0],
  [TRIAD_INV1, 0],
  [TRIAD_INV2, 0],
  [SEVENTH_INV2, 1],
]
.forEach(([chordType, scaleDegree], chordIndex) => {
  const chord = new Chord(chordType, scaleDegree, scale);
  [0,1,2,3,2,1].forEach((arpPosition, arpIndex, arpPattern) => {
    const count = arpIndex + arpPattern.length * chordIndex; // increments by 1 every loop
    // schedule one note every half beat:
    scheduler.at(count/2, beats => output.note(chord.pitch(arpPosition)))
  })
});

output.open();
scheduler.start();
