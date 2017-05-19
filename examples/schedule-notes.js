const { Output, Scheduler } = require('chorus/midi');

Output.select({ defaultDuration: 400 })
  .then(output => {
    const note = output.note.bind(output);
    const scheduler = new Scheduler({ bpm: 120 });
    scheduler.at(0, () => note(60) & note(64));
    scheduler.at(1, () => note(64) & note(67));
    scheduler.at(2, () => note(67) & note(72));
    scheduler.at(3, () => note(72) & note(60) & note(48));
    scheduler.start();
  });
