require('../src/names').into(global);
const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');

const scheduler = new Scheduler({ bpm: 120 });
const output = new MIDIOut({ defaultDuration: 200 });
const scale = MAJOR.at(C);

[0,1,2,3,4,5,6,7,6,5,4,3,2,1,0].forEach((step, index) => {
  scheduler.at(index/2, beats => output.note(scale.pitch(step)))
});

output.open();
scheduler.start();
