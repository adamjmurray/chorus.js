require('../src/globals');
const Scheduler = require('../src/time/scheduler');
const { MIDIOut } = require('../src/midi');
const out = new MIDIOut({ duration: 250 });
out.open();
const note = out.note.bind(out);

const s = new Scheduler();
s.at(   0, () => note(C4) || note(E4));
s.at( 500, () => note(E4) || note(G4));
s.at(1000, () => note(G4) || note(C5));
s.at(1500, () => note(C5) || note(Eb4) || note(C3));
s.start();
