const Section = require('./section');
const { noteJSON } = require('../utils');

/**
 * An object that generates entire songs.
 *
 * See the overview on the [documentation homepage](./index.html).
 * @implements [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
 * @implements [toJSON()]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior}
 */
class Song {

  /**
   * @arg {Object} options
   * @arg {Section[]|Object[]} options.sections the Song's sections as either an Array of {@link Section} objects,
   *              or an Array of options objects for the [Section constructor]{@link Section}
   * @arg {Number} [options.bpm=120] the tempo of the song in beats per minute (a beat is the unit of time)
   * @arg {Scale} [options.scale] default section scale, optional if every {@link Section} defines its scale
   * @arg {Number} [options.sectionLength] default section length, optional if every {@link Section} defines its own length
   */
  constructor({sections=[], bpm=120, scale, sectionLength}={}) {
    this.bpm = bpm;
    this.sections = sections.map(s =>
      s instanceof Section ? s : new Section(Object.assign({ scale, length: sectionLength }, s))
    );
    this.length = this.sections.map(s => s.length).reduce((l1,l2) => l1+l2, 0);
  }

  /**
   * @function @@iterator
   * @memberOf Song
   * @instance
   * @description The `[Symbol.iterator]()` generator function* that implements the
   *              [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols|MDN: Iteration Protocols}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator|MDN: Symbol.iterator}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*|MDN: function*}
   */
  *[Symbol.iterator]() {
    const {bpm, sections} = this;
    yield {type: 'bpm', value: bpm};
    let timeOffset = 0;
    for (const section of sections) {
      for (const event of section) {
        yield noteJSON(event, timeOffset);
      }
      timeOffset += section.length;
    }
  }

  /**
   * Serialize the Song into a JSON object
   * @todo document the format, example output
   * @returns {Object} JSON object representation (a "plain" JavaScript object containing only Numbers, Strings, Arrays, and nested Objects)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior|MDN: JSON.stringify()'s toJSON() behavior}
   */
  toJSON() {
    let bpm;
    const tracks = [];
    for (const event of this) {
      if (event.type === 'bpm') {
        bpm = event.value;
      } else {
        const trackIdx = (event.channel || 1) - 1;
        let track = tracks[trackIdx];
        if (!track) track = tracks[trackIdx] = [];
        track.push(event);
      }
    }
    for (const track of tracks) {
      track.push({ type: 'track-end', time: this.length });
    }
    return { bpm, tracks };
  }
}

module.exports = Song;
