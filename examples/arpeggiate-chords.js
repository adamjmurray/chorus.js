require('../src/names').into(global);
const { Output, Scheduler } = require('../src/midi');

const scheduler = new Scheduler({ bpm: 120 });
const scale = MAJOR(C);
const chords = [TRIAD(0), TRIAD(5,{inv:-2}), TRIAD(3,{inv:-1}), SEVENTH(4,{inv:-2})];

Output.select({ defaultDuration: 200 }).then(output => {
  let count;
  chords.forEach((chord, chordIndex) => {
    [0,1,2,3,2,1].forEach((arpPosition, arpIndex, arpPattern) => {
      count = arpIndex + arpPattern.length * chordIndex; // increments by 1 every loop
      // schedule one note every half beat:
      scheduler.at(count/2, beats => output.note(chord.pitch(arpPosition, { scale })))
    })
  });
  // and then resolve to the first note of the first chord:
  count++;
  scheduler.at(count/2, beats => output.note(chords[0].pitch(0, { scale }), 70, 800));
  scheduler.start();
});
