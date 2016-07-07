const Scheduler = require('../time/scheduler');
const Section = require('./section');

/**
 * A Song
 */
class Song {

  constructor({bpm=120, sections}) {
    this.bpm = bpm;
    this.sections = sections.map(s => s instanceof Section ? s : new Section(s));
  }

  play(output) {
    const {bpm, sections} = this;
    var scheduler = new Scheduler({bpm});
    // TODO: rework this into a generator function. Make the scheduler be able to play the Song iterator
    // and/or provide a toJSON(). Make it work with MIDI file output!
    for (const section of sections) {
      for (const event of section) {
        const trackIdx = event.track; // this will be needed for MIDI file output or toJSON()
        const note = event.note;
        const noteJSON = note.toJSON();
        scheduler.at(event.time, () => {
          output.note(noteJSON.pitch, noteJSON.velocity, noteJSON.duration * 60000/bpm, noteJSON.channel);
        })
      }
    }
    scheduler.start();
    return scheduler; // so the caller can stop it if desired
  }
}

module.exports = Song;
