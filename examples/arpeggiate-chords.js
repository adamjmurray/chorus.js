require('../src/names').into(global);
const { Scheduler, MIDIOut } = require('../src/midi');

const scheduler = new Scheduler({ bpm: 120 });
const output = new MIDIOut({ defaultDuration: 200 });
const scale = MAJOR.C;

[TRIAD(0), TRIAD(5,{inv:-2}), TRIAD(3,{inv:-1}), SEVENTH(4,{inv:-2})]
.forEach((chord, chordIndex) => {
  [0,1,2,3,2,1].forEach((arpPosition, arpIndex, arpPattern) => {
    const count = arpIndex + arpPattern.length * chordIndex; // increments by 1 every loop
    // schedule one note every half beat:
    scheduler.at(count/2, beats => output.note(chord.pitch(arpPosition, { scale })))
  })
});

output.open();
scheduler.start();
