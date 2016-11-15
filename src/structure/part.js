const Rhythm = require('./rhythm');
const Sequencer = require('./sequencer');

/**
 * A part of a {@link Section}.
 *
 * Represents a musical idea, such as a melody, bassline, or drum groove.
 * Produces musical notes whose {@link Pitch} (normally) depends on the
 * {@link Scale} and {@link Harmony} of the containing {@link Section}
 *
 * See the overview on the [documentation homepage](./index.html).
 * @extends Sequencer
 */
class Part extends Sequencer {

  /**
   * @arg {Object} options
   * @arg {Number} options.channel The MIDI channel that this part's notes will output to.
   *
   * When using realtime MIDI output, the channel you use depends on what receives the MIDI.
   * For example, you can use this to route to different tracks in your DAW.
   *
   * For MIDI file output, the part channel determines which MIDI file track will be used.
   *
   * Using the same channel for multiple parts can be used to, for example, create polyrhythms or counterpoint.
   *
   * Must be provided unless this instance is constructed by the containing {@link Section},
   * in which case it will default to the `index+1` within that section's parts list.
   * @arg {String} [options.mode] Determines how the containing {@link Section} interprets pitch numbers
   * in this Part. Depending on the mode, pitch numbers will be relative to the section's {@link Scale}
   * or the current {@link Chord} of the section's {@link Harmony}.
   *
   * Any integer pitch number is allowed as long as it produces a valid MIDI pitch value (TODO explain/link).
   * When there are no more pitches in the scale/chord because the pitch number is too large,
   * it wraps around to the beginning of the scale/chord an octave up.
   * Negative numbers go downward and wrap around an octave down. TODO: is there a better place to explain this (in Scale/Chord)?
   *
   * Note: When the pitch is a {@link Pitch} object, that pitch will be produced and the mode has no effect.
   *
   * Supported mode values:
   * - `"scale"` - Pitch numbers are relative to the section's scale and only produce notes from that scale.
   *
   *   `0` is the scale's first pitch, `1` is the scale's second pitch, `2` is the third, and so on.
   *   When the index wraps around, it produces the scale's first pitch an octave up.
   *   Negative numbers go down the octaves (`-1` is the scale's last pitch an octave down).
   *
   *   Use `"scale"` mode to explore scales while ignoring the current harmony/chords.
   *
   * - `"chromatic"` - Produces any pitch relative to the scale's first note.
   *
   *  `0` is the scale's first pitch. `1` is the next pitch higher regardless of whether it's in the scale or not.
   *  `-1` is the next lower pitch below `0`.
   *
   *  Use `"chromatic"` mode to remove pitch constraints when using relative pitch numbers.
   *
   * - `"lead"` - Similar to `"scale"` mode, except `0` starts from the first note of the current chord.
   *
   *   Use `"lead"` mode for melodies.
   *
   * - `"bass"` - Similar to `"scale"` mode, except `0` starts from the root note of the current chord (ignoring any chord inversions).
   *   TODO: document Chord inversions and link
   *
   *   Use `"bass"` mode for basslines.
   *
   * - `"chord"` - Produces the current chord.
   *
   *   `0` is exactly the current chord, `1` is the next chord inversion up,
   *   `-1` is the next chord inversion down, and so on.
   *
   *   Use `"chord"` mode to play the chord progression.
   *
   * - `"arpeggio"` - [arpeggiates](https://en.wikipedia.org/wiki/Arpeggio) the current chord.
   *
   *   A pitch value `0` is the chord's first pitch, `1` is the chord's second pitch, `2` is the third, and so on.
   *
   *   Use `"arpeggio"` mode to play the chord progression one note at a time.
   *
   * - `null` (no mode) - If no mode is set, pitch numbers are ambiguous and all pitches must be {@link Pitch} objects.
   *
   *   Use no mode / pitch objects for drum parts.
   *
   * The supported modes are available via static {@link Part.MODES} constants of this class.
   *
   * @arg {Iterable} options.pitches
   * @arg {Rhythm|Iterable} options.rhythm
   * @arg {Number} [options.rate=1]
   * @arg {Number} [options.octave=4]
   * @arg {Number} [options.length] The length of the part in beats.
   *
   * Must be provided when the `looped` option is true.
   *
   * Also note the containing {@link Section} will default its length to the max length
   * of its parts, so set your section and/or part lengths accordingly.
   * @arg {Boolean} [options.looped=false] If true, this part will repeat infinitely, starting from the beginning each
   * time the part length is reached.
   * @arg {Number} [options.delay=0] Delays the start of the part (relative to the start of the containing {@link Section})
   * by the given number of beats.
   */
  constructor({ channel, mode, pitches=[], rhythm, rate=1, octave=4, length, looped=false, delay=0 }={}) {
    rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, {rate});
    length = length || rhythm.length;
    super({ time: rhythm, pitch: pitches }, { length, looped, delay });
    this.channel = channel;
    this.mode = mode;
    this.pitches = pitches;
    this.rhythm = rhythm;
    this.octave = octave;
  }
}

// TODO: Should we move the verbose constructor documentation for the individual modes down here?
/**
 * Constants for all supported Part.mode options. See [constructor documentation]{@link Part} for descriptions.
 * @const
 * @prop ARPEGGIO {String}
 * @prop BASS {String}
 * @prop CHORD {String}
 * @prop CHROMATIC {String}
 * @prop LEAD {String}
 * @prop SCALE {String}
 */
Part.MODES = Object.freeze({
  ARPEGGIO: 'arpeggio',
  BASS: 'bass',
  CHORD: 'chord',
  CHROMATIC: 'chromatic',
  LEAD: 'lead',
  SCALE: 'scale',
});

module.exports = Object.freeze(Part);
