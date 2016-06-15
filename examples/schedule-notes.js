const Scheduler = require('../src/time/scheduler');
const { MIDIOut } = require('../src/midi');
const out = new MIDIOut();
out.open();

const s = new Scheduler();
s.at(   0, () => out.note(60));
s.at( 500, () => out.note(64));
s.at(1000, () => out.note(67));
s.at(1500, () => out.note(72));
s.start();
