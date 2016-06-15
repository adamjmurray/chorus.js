const Scheduler = require('../src/time/scheduler');
const { MIDIOut } = require('../src/midi');
const out = new MIDIOut();
out.open();

const s = new Scheduler();
s.clear();
s.at(0, (() => out.note(60)));
s.at(1000, (() => out.note(62)));
s.at(2000, (() => out.note(64)));
s.start();
