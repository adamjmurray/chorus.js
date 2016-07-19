const Section = require('./section');

/**
 * A Song
 */
class Song {

  constructor({bpm=120, sections}) {
    this.bpm = bpm;
    this.sections = sections.map(s => s instanceof Section ? s : new Section(s));
  }

  *[Symbol.iterator]() {
    const {bpm, sections} = this;
    yield {type: 'bpm', value: bpm};
    for (const section of sections) {
      for (const event of section) {
        const {time, note} = event;
        const data = note.toJSON();
        data.time = time;
        yield data;
      }
    }
  }

  toJSON() {
    const {bpm, sections} = this;
    const tracksJSON = [];
    for (const section of sections) {
      for (const event of section) {
        const trackIdx = event.track; // this will be needed for MIDI file output or toJSON()
        let trackJSON = tracksJSON[trackIdx];
        if (!trackJSON) trackJSON = tracksJSON[trackIdx] = [];
        trackJSON.push(Object.assign({ time: event.time }, event.note.toJSON()));
      }
    }
    // TODO: make this bpm be compatible with serializer (which doesn't even output a tempo event yet...)
    return { bpm, tracks: tracksJSON };
  }
}

module.exports = Song;
