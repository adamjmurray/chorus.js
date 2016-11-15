require('../src/names').into(global);
const { MidiOut, Scheduler } = require('../src/midi');
const scheduler = new Scheduler({ bpm: 120 });

MidiOut.select({ defaultDuration: 200 }).then(output => {
  const note = output.note.bind(output);
  scheduler.at(0, () => note(C4) & note(E4));
  scheduler.at(1, () => note(E4) & note(G4));
  scheduler.at(2, () => note(G4) & note(C5));
  scheduler.at(3, () => note(C5) & note(Eb4) & note(C3));
  scheduler.start();
});
