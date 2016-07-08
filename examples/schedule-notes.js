const { Scheduler, MIDIOut } = require('../src/midi');

const output = new MIDIOut({ defaultDuration: 400 });
const note = output.note.bind(output);
const scheduler = new Scheduler({ bpm: 120 });

scheduler.at(0,beats => note(60) & note(64));
scheduler.at(1,beats => note(64) & note(67));
scheduler.at(2,beats => note(67) & note(72));
scheduler.at(3,beats => note(72) & note(60) & note(48));

output.open();
scheduler.start();
