const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');

const output = new MIDIOut({ defaultDuration: 400 });
const note = output.note.bind(output);
const scheduler = new Scheduler();

scheduler.at(   0,ms => note(60) & note(64));
scheduler.at( 500,ms => note(64) & note(67));
scheduler.at(1000,ms => note(67) & note(72));
scheduler.at(1500,ms => note(72) & note(60) & note(48));

output.open();
scheduler.start();
