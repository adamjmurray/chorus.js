require('../src/names').into(global);
const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');
const { Scale } = require('../src/model');

const scheduler = new Scheduler();
const output = new MIDIOut({ defaultDuration: 200 });
const scale = new Scale(C, MAJOR);

[0,1,2,3,4,5,6,7,6,5,4,3,2,1,0].forEach((step, t) => {
  scheduler.at(t * 250,ms => output.note(scale.pitch(step)))
});

output.open();
scheduler.start();
