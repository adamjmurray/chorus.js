require('../src/model').inject(global);
const { Scheduler } = require('../src/time');
const { MIDIOut } = require('../src/midi');

const scheduler = new Scheduler();
const output = new MIDIOut({ defaultDuration: 200 });
const note = output.note.bind(output);

scheduler.at(   0,ms => note(C4) & note(E4));
scheduler.at( 500,ms => note(E4) & note(G4));
scheduler.at(1000,ms => note(G4) & note(C5));
scheduler.at(1500,ms => note(C5) & note(Eb4) & note(C3));

output.open();
scheduler.start();
