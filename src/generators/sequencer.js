/**
 * A Sequencer
 */
class Sequencer {

  constructor({rhythm, pitches, intensities} = {}) {
    this.rhythm = rhythm;
    this.pitches = pitches;
    this.intensities = intensities; // TODO
  }

  *[Symbol.iterator]() {
    let index = 0;
    for (const event of this.rhythm) {
      const pitchOrPitches = this.pitches[index++ % this.pitches.length]; // TODO: option to control this behavior (e.g. stop when you run out of pitches)
      if (pitchOrPitches[Symbol.iterator]) {
        for (const pitch of pitchOrPitches) {
          event.pitch = pitch;
          yield event;
        }
      } else {
        event.pitch = pitchOrPitches;
        yield event;
      }
    }
  }
}

module.exports = Sequencer;
