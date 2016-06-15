const Scheduler = require('../src/time/scheduler');
const { MIDIOut } = require('../src/midi');
const out = new MIDIOut({ duration: 250 });
out.open();

const s = new Scheduler();
s.at(   0, () => out.note(60) || out.note(64));
s.at( 500, () => out.note(64) || out.note(67));
s.at(1000, () => out.note(67) || out.note(72));
s.at(1500, () => out.note(72) || out.note(60) || out.note(48));
s.start();
