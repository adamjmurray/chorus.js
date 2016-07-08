require('../src/names').into(global);
const { Scheduler, MIDIOut } = require('../src/midi');

const scheduler = new Scheduler({ bpm: 120 });
const output = new MIDIOut({ defaultDuration: 200 });
const note = output.note.bind(output);

scheduler.at(0, beats => note(C4) & note(E4));
scheduler.at(1, beats => note(E4) & note(G4));
scheduler.at(2, beats => note(G4) & note(C5));
scheduler.at(3, beats => note(C5) & note(Eb4) & note(C3));

output.open();
scheduler.start();
