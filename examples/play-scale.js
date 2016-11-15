require('../src/names').into(global);
const { Scheduler } = require('../src/midi');
const { MidiOut } = require('../src/midi');
const scheduler = new Scheduler({ bpm: 120 });
const scale = MAJOR(C);

MidiOut.select({ defaultDuration: 200 }).then(output => {
  [0,1,2,3,4,5,6,7,6,5,4,3,2,1,0].forEach((step, index) => {
    scheduler.at(index/2, () => output.note(scale.pitch(step)))
  });
  scheduler.start();
});
