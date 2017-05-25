var chorus = (function () {
'use strict';

/**
 * A pitch that is relative to another pitch in a scale or chord.
 * It is converted to a pitch by {@link Scale#pitch|Scale.pitch()} or {@link Chord#pitch|Chord.pitch()}
 */
class RelativePitch$1 {

  /**
   *
   * @param degree the number of scale degrees (pitches in the scale) relative to the base pitch
   * @param shift applies a chromatic shift (AKA an accidental) to allow for pitches outside the scale.
   */
  constructor(degree, shift=0) {
    if (degree.constructor === Object) {
      this.degree = degree.degree || 0;
      this.shift = degree.shift || 0;
    } else {
      this.degree = degree;
      this.shift = shift;
    }
    Object.freeze(this);
  }

  valueOf() {
    return this.degree; // we lose the shift when adding/subtracting the degree
  }

  add(relativePitch) {
    const degree = relativePitch.degree || Number(relativePitch);
    // The added relativePitch's shift supersedes this shift
    // If relativePitch is just a number, we lose the shift
    const shift = relativePitch.shift || 0;
    return new RelativePitch$1(this.degree + degree, shift);
  }
}

var relativePitch = RelativePitch$1;

// modulo function that always returns a positive number
function mod$1(dividend, divisor) {
  let value = dividend % divisor;
  if (value < 0) value += divisor;
  return value;
}

function clamp(value, min, max) {
  if (value == null) value = min;
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}

function clampInt(value, min, max) {
  return Math.round(clamp(value, min, max));
}

function fractRound(value, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}

function noteJSON(noteEvent, timeOffset) {
  const note = noteEvent.note;
  return {
    time: noteEvent.time + timeOffset,
    type: 'note',
    pitch: clampInt(note.pitch+0, 0, 127), // + 0 coerces to an int
    velocity: clampInt(note.intensity*127, 0, 127),
    duration: clamp(note.duration, 0),
    release: 100,
    channel: clamp(note.channel, 1, 16),
  }
}

/*
 * Run a list of asynchronous operations sequentially (waiting until one finishes before starting the next).
 * @param asyncOperations {Array} An Array functions that initiate an async operation when called and return a Promise
 * @returns {Promise} A Promise that resolves after all async operations have completed
 */
function sequentialAsync(asyncOperations) {
  const asyncOp = asyncOperations.shift();
  return asyncOp ? asyncOp().then(() => sequentialAsync(asyncOperations)) : Promise.resolve();
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
}

function take(iterator, n) {
  iterator = iterator[Symbol.iterator] ? iterator[Symbol.iterator]() : iterator;
  const values = [];
  for (let i=0; i<n; i++) values.push(iterator.next().value);
  return values;
}

var utils = { mod: mod$1, clamp, clampInt, fractRound, noteJSON, sequentialAsync, sleep, take };

const { mod } = utils;

function findUniqueOctaveOffset(relativePitches, scaleLength, direction) {
  if (direction < 0) relativePitches = relativePitches.slice().reverse();
  for (let octave=direction; true; octave += direction) { // eslint-disable-line no-constant-condition
    for (const {degree,shift} of relativePitches) {
      const invertedDegree = degree + (octave * scaleLength);
      if (!relativePitches.find(({degree:d,shift:s}) => (d === invertedDegree && s === shift))) {
        return new relativePitch(invertedDegree, shift);
      }
    }
  }
}

function relativePitchesForInversion(relativePitches, inversion, scaleLength) {
  relativePitches = relativePitches.slice(); // make a copy
  for (let i =  1; i <= inversion; i++) {
    relativePitches.push(findUniqueOctaveOffset(relativePitches, scaleLength, 1));
    relativePitches.shift();
  }
  for (let i = -1; i >= inversion; i--) {
    relativePitches.unshift(findUniqueOctaveOffset(relativePitches, scaleLength, -1));
    relativePitches.pop();
  }
  return relativePitches;
}

/**
 * A chord
 */
class Chord$1 {

  /**
   *
   * @param relativePitches
   * @param inversion
   */
  constructor(relativePitches, { inversion=0, scale }={}) {
    relativePitches = relativePitches.map(rp => rp instanceof relativePitch ? rp : new relativePitch(rp));
    this.relativePitches = Object.freeze(relativePitches);
    this.inversion = inversion;
    this.scale = scale;
    Object.freeze(this);
  }

  /**
   *
   * @param scale
   * @param octave
   * @param inversion
   * @param offset
   * @returns {Array}
   */
  pitches({ scale=this.scale, octave=4, inversion=this.inversion, offset=0, }={}) {
    const relativePitches = relativePitchesForInversion(this.relativePitches, inversion, scale.length);
    const pitches = relativePitches.map(relativePitch$$1 =>
      // Only add the additional offset if it's non-zero offset, because it causes the relativePitch's shift to be lost
      scale.pitch(offset ? relativePitch$$1.add(offset) : relativePitch$$1, { octave }));
    return pitches;
  }

  /**
   *
   * @param position {Number|RelativePitch}
   * @param inversion
   * @returns {*}
   */
  pitch(position, { scale=this.scale, octave=4, inversion=this.inversion, offset=0 }={}) {
    const shift = position.shift || 0;
    position = position.degree || Number(position);
    const pitches = this.pitches({ scale, octave, inversion, offset });
    const pitch = pitches[mod(position, pitches.length)];
    const octaveOffset = Math.floor(position / pitches.length);
    return pitch.add(octaveOffset * scale.semitones + shift);
  }

  inv(inversion) {
    if (!inversion) return this;
    return new Chord$1(this.relativePitches, { inversion, scale: this.scale });
  }
}

var chord = Chord$1;

const { mod: mod$2 } = utils;

const PITCH_CLASS_VALUES = Object.freeze({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 });

function invalid(string) {
  throw new Error(`Invalid PitchClass name: ${string}`)
}

/**
 * A PitchClass represents a set of all pitches that are octaves apart from each other.
 * A PitchClass and an octave number defines a {@link Pitch}.
 * <br><br>
 * A PitchClass has a value and a name.
 * PitchClasses operate in a "mod 12" modular arithmetic space, where 0, 12, 24, 36, etc are considered equal.
 * The canonical PitchClass values are [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
 * <br><br>
 * The basic PitchClass names are "C", "D", "E", "F", "G", "A", "B".
 * You can construct a PitchClass using a basic name, optionally followed by sharps "#" or flats "b".
 * Sharps and flats increment or decrement the value respectively. See examples below.
 *
 * @example
 * // Constructing by name
 * new PitchClass('C')
 * new PitchClass('Db') // same as PitchClass('C#')
 * new PitchClass('D')  // Same as PitchClass('C##') or PitchClass('Ebb')
 * new PitchClass('Db') // same as PitchClass('D#')
 * new PitchClass('E')
 * new PitchClass('F')
 * new PitchClass('Gb')
 * new PitchClass('G')
 * new PitchClass('Ab')
 * new PitchClass('A')
 * new PitchClass('Bb')
 * new PitchClass('B')
 *
 * // Constructing by value
 * new PitchClass(0) // same as PitchClass('C') or PitchClass(12)
 * new PitchClass(1) // same as PitchClass('Db')
 * ...
 * new PitchClass(11) // same as PitchClass('B')
 *
 * @see https://en.wikipedia.org/wiki/Pitch_class
 * @see https://en.wikipedia.org/wiki/Octave
 */
class PitchClass$1 {

  /**
   * The canonical names of all pitch classes, indexed by their value.
   * Note that some names have aliases. For example: "C#" is equivalent to "Db", and "Fbb" is equivalent to "Eb"
   * @returns {Array}
   */
  static get NAMES() {
    return Object.freeze(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']);
  }

  /**
   * @param nameOrValue {number|string} a PitchClass numerical value or string name.
   */
  constructor(nameOrValue, { pitchesPerOctave=12 }={}) {
    let value;
    if (typeof nameOrValue === 'number') {
      value = nameOrValue;
    }
    else {
      const string = nameOrValue.toString();
      value = PITCH_CLASS_VALUES[string[0].toUpperCase()];
      if (value == null) invalid(string);
      for (let i = 1; i < string.length; i++) {
        switch (string[i]) {
          case 'b': value--; break;
          case '#': value++; break;
          default: invalid(string);
        }
      }
    }
    this.pitchesPerOctave = pitchesPerOctave;
    value = mod$2(Math.round(value), pitchesPerOctave);
    /**
     * The canonical name of this PitchClass. See {@link PitchClass.NAMES}
     * @member {PitchClass}
     * @readonly */
    this.name = pitchesPerOctave === 12 ? PitchClass$1.NAMES[value] : String(value);
    /**
     * The number of semitones above C. Used to compute {@link Pitch#value MIDI pitch values}.
     * This is always the canonical value in the range 0-11 (inclusive). Assigning this property will convert to the
     * equivalent canonical value.
     * @member {Number}
     * @readonly */
    this.value = value;
    Object.freeze(this);
  }

  valueOf() {
    return this.value;
  }

  inspect() {
    return this.name;
  }

  add(value) {
    return new PitchClass$1(this.value + value, { pitchesPerOctave: this.pitchesPerOctave });
  }
}

var pitchClass = PitchClass$1;

/**
 * A Pitch is an immutable representation of the frequency of a musical note.
 * It consists of a {@link PitchClass} and an octave number.
 * It has an underlying value for MIDI pitch, which supports the range 0 to 127 (inclusive).
 *
 * @example
 * // The following are equivalent:
 * new Pitch(60);
 * new Pitch(new PitchClass('C'), 4);
 * new Pitch(new PitchClass('C')); // default octave is 4
 * new Pitch('C4');
 * new Pitch('C', 4);
 * new Pitch('C'); // default octave is 4
 */
class Pitch$1 {

  /**
   * The maximum pitch value supported by MIDI: 127. Note the minimum value is 0.
   */
  static get MAX_VALUE() {
    return 127;
  }

  /**
   * @param {number|PitchClass|string} value - The numeric pitch value, or a PitchClass, or a string of the pitch class name and optional octave. See examples below.
   * @param {number} [octave=4] - The octave to use when the first argument is a PitchClass or a string without the octave. The octave should be in the range -1 to 9 (inclusive) to avoid invalid pitch values.
   */
  constructor(value, octave=4, { pitchesPerOctave=12, pitchValueOffset=0 }={}) {
    let pitchClass$$1;
    if (typeof value === 'number') {
      pitchClass$$1 = new pitchClass(value, { pitchesPerOctave });
      octave = Math.floor(value / pitchesPerOctave) - 1;
      value += pitchValueOffset;
    }
    else {
      if (value instanceof pitchClass) {
        pitchClass$$1 = value;
      }
      else {
        const string = value.toString();
        const matches = /([A-Ga-g][b#]*)([-_]1|[0-9])$/.exec(string);
        if (matches) {
          pitchClass$$1 = new pitchClass(matches[1]);
          octave = Number(matches[2].replace('_','-'));
        }
        else {
          pitchClass$$1 = new pitchClass(string);
        }
      }
      value = pitchClass$$1.value + pitchClass$$1.pitchesPerOctave * (octave + 1) + pitchValueOffset;
    }
    /**
     * @member {PitchClass}
     * @readonly */
    this.pitchClass = pitchClass$$1;
    /**
     * @member {number}
     * @readonly */
    this.octave = octave;
    /**
     * The MIDI pitch value. Should be in the range 0 to 127 (inclusive).
     * @member {number}
     * @readonly */
    this.value = value;
    /**
     * The [canonical name]{@link module:Names.PITCHES} for this Pitch.
     * @member {string}
     * @readonly */
    this.name = pitchClass$$1.pitchesPerOctave === 12 ?
      `${pitchClass$$1.name}${octave.toString().replace('-', '_')}` : String(value);
    Object.freeze(this);
  }

  valueOf() {
    return this.value;
  }

  inspect() {
    return this.name;
  }

  /**
   * Return a new Pitch whose value is the sum of this Pitch's value and the given value
   * @param value {number} the value to add to this Pitch's value
   * @returns {Pitch}
   */
  add(value) {
    if (!value) return this;
    return new Pitch$1(this.value + value, null, {
      pitchesPerOctave: this.pitchClass.pitchesPerOctave,
      pitchValueOffset: this.pitchValueOffset,
    });
  }
}

var pitch = Pitch$1;

const { mod: mod$3 } = utils;

// The raw value for the pitch class that hasn't had modular math applied to "normalize" it,
// so octave offsets can be calculated properly in Scale.pitch()
function pitchValue(scale, relativePitch) {
  const degree = relativePitch.degree || Number(relativePitch);
  let value = Number(scale.root);
  for (let i =  0; i < degree;  i++) value += scale.intervals[i % scale.length];
  for (let i = -1; i >= degree; i--) value -= scale.intervals[mod$3(i, scale.length)];
  value += relativePitch.shift || 0;
  return value;
}

/**
 * A list of pitch classes, which can be converted to pitches
 *
 * @see https://en.wikipedia.org/wiki/Scale_(music)
 */
class Scale$1 {

  constructor(intervals, root=new pitchClass(0), { pitchValueOffset=0 }={}) {
    if (!(intervals instanceof Array)) throw new TypeError('Scale intervals must be an Array');
    // list of integers for the interval distance between consecutive notes of the scale:
    // intervals sum is root.pitchesPerOctave (usually 12) for octave-repeating scales
    const pitchesPerOctave = intervals.reduce((a,b) => a+b, 0);
    this.intervals = Object.freeze(intervals.slice());
    this.root = new pitchClass(Number(root), {pitchesPerOctave});
    this.pitchValueOffset = pitchValueOffset;
    Object.freeze(this);
  }

  get length() {
    return this.intervals.length;
  }

  /**
   * The size of the scale in semitones (keys on a piano keyboard).
   * For most scales, this value will be 12, which means the scale repeats every octave.
   * In other words, when this is 12, if the scale starts on a C, it will end on the next higher C.
   */
  get semitones() {
    return this.intervals.reduce((a,b) => a + b, 0);
  }

  /**
   *
   * @param relativePitch {Number|RelativePitch}
   * @returns {PitchClass}
   */
  pitchClass(relativePitch) {
    return new pitchClass(pitchValue(this, relativePitch), { pitchesPerOctave: this.root.pitchesPerOctave });
  }

  /**
   *
   * @param relativePitch {Number|RelativePitch}
   * @param octave {Number}
   * @returns {Pitch}
   */
  pitch(relativePitch, { octave=4 }={}) {
    const value = pitchValue(this, relativePitch);
    const pitchClass$$1 = new pitchClass(value, { pitchesPerOctave: this.root.pitchesPerOctave });
    return new pitch(pitchClass$$1, octave + Math.floor(value / this.root.pitchesPerOctave), {
      pitchValueOffset: this.pitchValueOffset,
    });
  }
}

var scale = Scale$1;

/**
 * @module model
 * @description
 * #### Core model used to build melodies, bass lines, and harmonic patterns.
 * - {@link Chord}
 * - {@link Pitch}
 * - {@link PitchClass}
 * - {@link RelativePitch}
 * - {@link Scale}
 */
var index = { Chord: chord, Pitch: pitch, PitchClass: pitchClass, RelativePitch: relativePitch, Scale: scale };

const CHORD_TYPES = {
  TRIAD: [0,2,4],
  TRIAD_SUS2:  [0,1,4],
  TRIAD_SUS4:  [0,3,4],
  TRIAD_PLUS_8: [0,2,4,7],
  QUARTAL: [0,3,6],
  QUINTAL: [0,4,8],
  SIXTH: [0,2,4,5],
  SEVENTH: [0,2,4,6],
  NINTH: [0,2,4,6,8],
};

/**
 * Built-in chords
 */
const CHORDS$1 = {};
Object.keys(CHORD_TYPES).forEach(type =>
  CHORDS$1[type] = (root, inversion) =>
    new chord(CHORD_TYPES[type].map(degree => root + degree), inversion));

var chords = Object.freeze(CHORDS$1);

const names = pitchClass.NAMES;

/**
 * Built-in pitch classes
 */
const PITCH_CLASSES$1 = {};
for (let i = 0; i < names.length; i++) {
  PITCH_CLASSES$1[names[i]] = new pitchClass(i);
}

var pitchClasses = Object.freeze(PITCH_CLASSES$1);

const MAX_VALUE = pitch.MAX_VALUE;

/**
 * Built-in pitches
 */
const PITCHES$1 = {};
for (let i = 0; i <= MAX_VALUE; i++) {
  const pitch$$1 = new pitch(i);
  PITCHES$1[pitch$$1.name] = pitch$$1;
}

var pitches = Object.freeze(PITCHES$1);

const SCALE_TYPES = {
  CHROMATIC: [1,1,1,1,1,1,1,1,1,1,1,1],
  // 8 pitches per octave:
  OCTATONIC: [2,1,2,1,2,1,2,1],
  OCTATONIC2: [1,2,1,2,1,2,1,2],
  BEBOP_DOMINANT: [2,2,1,2,2,1,1,1],
  BEBOP_DORIAN: [2,1,1,1,2,2,1,2],
  BEBOP_HARMONIC_MINOR: [2,1,2,2,1,2,1,1],
  BEBOP_MAJOR: [2,2,1,2,1,1,2,1],
  BEBOP_MELODIC_MINOR: [2,1,2,2,1,1,2,1],
  // 7 pitches per octave / diatonic scales:
  IONIAN:     [2,2,1,2,2,2,1],
  DORIAN:     [2,1,2,2,2,1,2],
  PHRYGIAN:   [1,2,2,2,1,2,2],
  LYDIAN:     [2,2,2,1,2,2,1],
  MIXOLYDIAN: [2,2,1,2,2,1,2],
  AEOLIAN:    [2,1,2,2,1,2,2],
  LOCRIAN:    [1,2,2,1,2,2,2],
  // 7 pitches per octave / other:
  ACOUSTIC: [2,2,2,1,2,1,2],
  ALTERED: [1,2,1,2,2,2,2],
  BYZANTINE: [1,3,1,2,1,3,1],
  ENIGMATIC: [1,3,2,2,2,1,1],
  FREYGISH: [1,3,1,2,1,2,2],
  HALF_DIMINISHED: [2,1,2,1,2,2,2],
  HARMONIC_MINOR: [2,1,2,2,1,3,1],
  HARMONIC_MAJOR: [2,2,1,2,1,3,1],
  HUNGARIAN: [2,1,3,1,1,2,2],
  HUNGARIAN_MINOR: [2,1,3,1,1,3,1],
  LOCRIAN_MAJOR: [2,2,1,1,2,2,2],
  LYDIAN_AUGMENTED: [2,2,2,2,1,2,1],
  MELODIC_MINOR: [2,1,2,2,2,2,1],
  NEAPOLITAN_MAJOR: [1,2,2,2,2,2,1],
  NEAPOLITAN_MINOR: [1,2,2,2,1,3,1],
  PELOG: [1,2,3,1,1,2,2],
  PERSIAN: [1,3,1,1,2,3,1],
  PHRYGIAN_DOMINANT: [1,3,1,2,1,2,2],
  UKRAINIAN_DORIAN: [2,1,3,1,2,1,2],
  // 6 pitches per octave:
  AUGMENTED: [3,1,3,1,3,1],
  BLUES: [3,2,1,1,3,2],
  OF_HARMONICS: [3,1,1,2,2,3],
  PROMETHEUS: [2,2,2,3,1,2],
  TRITONE: [1,3,2,1,3,2],
  WHOLE_TONE: [2,2,2,2,2,2],
  // 5 pitches per octave:
  PENTATONIC_MAJOR: [2,2,3,2,3],
  PENTATONIC_MINOR: [3,2,2,3,2],
  EGYPTIAN: [2,3,2,3,2],
  HIRAJOSHI: [4,2,1,4,1],
  INSEN: [1,4,2,3,2],
  IWATO: [1,4,1,4,2],
  MAN_GONG: [3,2,3,2,2],
  SAKURA: [1,4,2,1,4],
  SLENDRO: [2,3,2,2,3],
};
SCALE_TYPES.MAJOR = SCALE_TYPES.IONIAN;
SCALE_TYPES.MINOR = SCALE_TYPES.NATURAL_MINOR = SCALE_TYPES.AEOLIAN;

/**
 * Built-in scales
 */
const SCALES$1 = {};
Object.keys(SCALE_TYPES).forEach(type => {
  SCALES$1[type] = (root) => new scale(SCALE_TYPES[type], root);
});

var scales = Object.freeze(SCALES$1);

var drums = Object.freeze({
  KICK: new pitch(36),
  RIM: new pitch(37),
  SNARE: new pitch(38),
  CLAP: new pitch(39),
  CLOSED_HIHAT: new pitch(42),
  OPEN_HIHAT: new pitch(46),
  CYMBAL: new pitch(49),
});

/**
 * @module names
 * @description
 * #### Predefined constants for common musical objects and properties.
 * @example
 * // Inject all names into the global namespace.
 * // WARNING: This is not safe to do in large/serious projects, however,
 * // it is very convenient when experimenting with this library.
 * require('chorus/names').into(global);
 */
var index$2 = {

  /**
   * Built-in {@link Chord} types.
   *
   * <a href="./names_chords.js.html">The available CHORDS types are defined here</a>
   *
   * Note: whether a chord such as a triad is major, minor, diminished, or augmented depends on the scale and the root
   * of the chord. This is because chords in chorus.js are defined in terms of scale degrees, so you don't have to worry
   * about accidentally using notes that aren't part of the scale. If you don't know music theory, don't worry about it!
   * When using scales and chords in chorus.js, things will tend to sound good by default.
   *
   * @example
   * const { CHORDS } = require('chorus');
   * const { TRIAD, SEVENTH } = CHORDS;
   * const I_CHORD  = TRIAD(0);
   * const IV_CHORD = TRIAD(3);
   * const V7_CHORD = SEVENTH(4);
   * const vi_inv1_CHORD = TRIAD(5, 1); // first inversion
   * @see https://en.wikipedia.org/wiki/Triad_(music)
   * @see https://en.wikipedia.org/wiki/Suspended_chord
   * @see https://en.wikipedia.org/wiki/Quartal_and_quintal_harmony
   * @see https://en.wikipedia.org/wiki/Seventh_chord
   * @see https://en.wikipedia.org/wiki/Inversion_(music)#Chords
   */
  CHORDS: chords,

  /**
   * The 12 {@link PitchClass PitchClasses}:
   *
   * `C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B`
   */
  PITCH_CLASSES: pitchClasses,

  /**
   * The 128 {@link Pitch Pitches}:
   *
   * `C_1, Db_1, D_1, Eb_1, E_1, F_1, Gb_1, G_1, Ab_1, A_1, Bb_1, B_1, C0, Db0, D0, ..., Ab8, B8, C9, Cb9, D9, Db9, E9, F9, Gb9, G9`
   *
   * `C_1` is the minimum Pitch value of 0 (`"_1"` means -1 octave number).
   *
   * `G9` the is maximum Pitch value of 127.
   */
  PITCHES: pitches,

  /**
   * Built-in {@link Scale Scale} types.
   *
   * <a href="./names_scales.js.html">The available SCALES types are defined here</a>.
   *
   * @example
   * const { PITCH_CLASSES, SCALES } = require('chorus');
   * const { C } = PITCH_CLASSES;
   * const { MAJOR } = SCALES;
   * const cMajorScale = MAJOR(C);
   *
   * @see https://en.wikipedia.org/wiki/Scale_(music)
   * @see https://en.wikipedia.org/wiki/Mode_(music)#Modern
   * @see https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
   */
  SCALES: scales,

  DRUMS: drums,

  /**
   * Inject all predefined names into the given Object.
   * @param namespace {Object} the object whose properties will be destructively modified to set all name/values defined here
   */
  into(object) {
    return Object.assign(object, chords, pitchClasses, pitches, scales, drums);
  },
};

/**
 * Generic sequencing logic *intended for internal use*.
 *
 * The superclass of {@link Rhythm}, {@link Harmony}, and {@link Part}.
 */
class Sequencer {

  /**
   *
   * @param {Object} iterablesByName the property names and iterables used by @@iterator()
   * @param {Object} options see subclass documentation
   */
  constructor(iterablesByName={}, { length, looped=false, delay=0 }={}) {
    this.iterablesByName = iterablesByName;
    this.length = length;
    this.looped = looped;
    this.delay = delay;
  }

  /**
   * @function @@iterator
   * @memberOf Sequencer
   * @instance
   * @description The `[Symbol.iterator]()` generator function* that implements the
   *              [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols|MDN: Iteration Protocols}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator|MDN: Symbol.iterator}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*|MDN: function*}
   */
  *[Symbol.iterator]() {
    const iterablesByName = this.iterablesByName;
    const names =  Object.keys(iterablesByName);
    const iterables = names.map(name => iterablesByName[name]);
    const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
    const isDones = iterators.map(() => false);
    let timeOffset = this.delay;
    let result;
    do {
      if (result) yield result;
      const nexts = iterators.map(iterator => iterator.next());
      result = {};
      for (let i = 0; i < nexts.length; i++) {
        const name = names[i];
        if (nexts[i].done) {
          isDones[i] = true;
          iterators[i] = iterables[i][Symbol.iterator]();
          nexts[i] = iterators[i].next();
          if (nexts[i].done) return; // empty iterator, give up
          if (name === 'time') timeOffset += this.length;
        }
        let value = nexts[i].value;
        if (value && value.constructor === Object) {
          for (const subname of Object.keys(value)) {
            result[subname] = value[subname];
            if (subname === 'time') result[subname] += timeOffset;
          }
        } else {
          if (value && value.next instanceof Function) { // nested Iterator (such as a Random generator function)
            value = value.next().value;
          }
          result[name] = value;
          if (name === 'time') result[name] += timeOffset;
        }
      }
    } while (this.looped || isDones.includes(false));
  }
}

var sequencer = Sequencer;

/**
 * A chord progression generator.
 */
class Harmony$1 extends sequencer {

  /**
   * @param {Object} options
   * @param {Iterable} options.chords - The list of chords.
   * @param {Iterable} [options.durations=[1,1, ...]] - The list of chord durations. A duration of 1 is 1 beat.
   * @param {Boolean} [options.looped=false] - If true, the chords and durations sequences will auto-restart (independently from each other)
   *        for the duration of containing Section.
   */
  constructor({ chords=[], durations, looped=false }={}) {
    durations = (durations || new Array(chords.length || 1).fill(1)).map(Math.abs);
    const length = durations.reduce((a,b) => a + b, 0);
    const times = [];
    let time = 0;
    for (const duration of durations) {
      times.push(time);
      time += duration;
    }
    super({ time: times, chord: chords }, { length, looped });
    this.chords = chords;
    this.durations = durations;
  }
}

var harmony = Harmony$1;

/**
 * Generates `{time, intensity, duration}` values to control the groove of a {@link Part}.
 * @extends Sequencer
 */
class Rhythm$1 extends sequencer {

  /**
   * @param {Object} options
   * @param {String|Iterable} options.pattern When a String, it can contain the following characters:
   *   - `"X"` &rarr; accented note
   *   - `"x"` &rarr; normal note
   *   - `"="` &rarr; tie
   *   - `"."` &rarr; rest
   *
   * Each characters' duration is determined by the `pulse` option.
   * NOTE: Other characters are ignored and can be used to improve readability, for example `"X.x.|x==.|..x=|x=X="`
   *
   * When an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable|Iterable}
   * of delta-start times, it represents the time between each note (with the first note always starting immediately).
   * NOTE: Negative numbers can be used as rests, and the absolute value is the time until the next note.
   * @param {Number} [options.pulse=1] The duration in beats of each character in a String `pattern`.
   * Only relevant if the `pattern` option is a String.
   * @param {Iterable} [options.intensities=[0.7]]
   * Determines the note intensities in an Iterable `pattern`. Ignored if the `pattern` option is a String.
   * @param {Iterable} [options.durations=time between notes]
   * Determines the note durations in an Iterable `pattern`. Ignored if the `pattern` option is a String.
   * @param {Iterable} [options.length=pattern length]
   * Overrides the length of this rhythm to be different than the `pattern` length.
   * Useful when this rhythm is `looped` or when using {@link Random.duration}s.
   * @param {Iterable} [options.looped=false] If true, this rhythm will repeat infinitely. Note that delta-start times,
   * intensities, and durations loop independently for Iterable `pattern`s, which creates less repetitive rhythms.
   */
  constructor({ pattern=[], pulse=1, intensities, durations, length, looped=false } = {}) {
    const times = [];
    if (typeof pattern === 'string') {
      length = length || pattern.length * pulse;
      intensities = [];
      durations = [];
      let duration = null;
      let count = 0;
      for (const char of pattern) {
        switch (char) {
          case 'X':
            times.push(pulse * count);
            intensities.push(1);
            if (duration) durations.push(duration); // previous duration
            duration = pulse;
            count++;
            break;
          case 'x':
            times.push(pulse * count);
            intensities.push(0.7);
            if (duration) durations.push(duration); // previous duration
            duration = pulse;
            count++;
            break;
          case '=':
            if (duration) duration += pulse;
            count++;
            break;
          case '.':
            if (duration) durations.push(duration);
            duration = null;
            count++;
            break;
          default:
        }
      }
      if (duration) durations.push(duration);
    }
    else {
      length = length || pattern.map(Math.abs).reduce((a,b) => a + b, 0);
      const legatoDurations = [];
      let time = 0;
      let nextTime;
      for (const value of pattern) {
        nextTime = time + Math.abs(value);
        const duration = (nextTime - time) * Math.sign(value);
        if (duration > 0) {
          times.push(time);
          legatoDurations.push(duration);
        } // else this is a rest
        time = nextTime;
      }
      if (!durations) durations = legatoDurations;
    }
    intensities = intensities || [0.7];
    super({ time: times, intensity: intensities, duration: durations }, { length, looped });
    this.times = times;
    this.intensities = intensities;
    this.durations = durations;
  }

  /**
   * Generates a Rhythm pattern string by evenly distributes the given number of pulses into the given total number of
   * time units. Also known as a "Euclidean rhythm". Use the return value for the constructor's pattern option.
   * @param pulses {number}
   * @param total {number}
   * @param {Object} options
   * @param {Number} [options.shift=0] shifts the pattern (with wrap-around) by the given number of time units
   * @param {Number} [options.rotation=0] shifts the pattern (with wrap-around) to the given pulse index
   */
  static distribute(pulses, total, options={}) {
    const { rotation, shift } = options;
    let pattern = [];
    let count = 0;
    let nextPulse = Math.floor(++count/pulses * total);
    for (let i=1; i<=total; i++) {
      if (i < nextPulse) {
        pattern.push('.'); // rest
      } else {
        pattern.push('x'); // pulse
        nextPulse = Math.floor(++count/pulses * total);
      }
    }
    pattern = pattern.reverse();
    if (rotation) {
      for (let i =  1; i <= rotation; i++) {
        const slicePoint = pattern.indexOf('x', 1);
        if (slicePoint > 0) pattern = pattern.slice(slicePoint).concat(pattern.slice(0, slicePoint));
        else break;
      }
      for (let i = -1; i >= rotation; i--) {
        const slicePoint = pattern.lastIndexOf('x');
        if (slicePoint > 0) pattern = pattern.slice(slicePoint).concat(pattern.slice(0, slicePoint));
        else break;
      }
    }
    if (shift) {
      const slicePoint = shift % pattern.length;
      pattern = pattern.slice(slicePoint).concat(pattern.slice(0, slicePoint));
    }
    return pattern.join('');
  }
}

var rhythm = Rhythm$1;

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
class Part$1 extends sequencer {

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
   * @arg {Rhythm|String|Iterable|Object} [options.rhythm=pitches.map(p=>1)] Either a Rhythm object, or options for
   * the {@link Rhythm|Rhythm constructor}. When a String or Iterable, it's used as the `pattern` option for the Rhythm
   * constructor (for convenience). Otherwise, it's treated as the entire options object for the constructor.
   * @arg {Number} [options.pulse] When the `rhythm` option is a String, this gets passed to the
   * {@link Rhythm|Rhythm constructor}.
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
  constructor({ channel=1, mode, pitches=[], rhythm: rhythm$$1, pulse, octave=4, length, looped=false, delay=0 }={}) {
    if (!rhythm$$1) rhythm$$1 = pitches.map(() => 1);
    rhythm$$1 = rhythm$$1 instanceof rhythm ? rhythm$$1 : new rhythm(
      (typeof rhythm$$1 === 'string' || rhythm$$1 instanceof Array) ? { pattern: rhythm$$1, pulse } : rhythm$$1
    );
    length = length || rhythm$$1.length;
    super({ time: rhythm$$1, pitch: pitches }, { length, looped, delay });
    this.channel = channel;
    this.mode = mode;
    this.pitches = pitches;
    this.rhythm = rhythm$$1;
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
Part$1.MODES = Object.freeze({
  ARPEGGIO: 'arpeggio',
  BASS: 'bass',
  CHORD: 'chord',
  CHROMATIC: 'chromatic',
  LEAD: 'lead',
  SCALE: 'scale',
});

var part = Object.freeze(Part$1);

/* eslint no-constant-condition: off */

/**
 * A collection of
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*|generator functions}
 * that yield random values for use in other [Structure](./module-Structure.html) classes.
 */
class Random$1 {

  /**
   * Don't use. All functions in this class are static.
   * @ignore
   */
  constructor() {}

  /**
   * Randomly yield an integer suitable for relative pitches in a {@link Part}.
   *
   * The default min and max work well with 3-note chords when the part's {@link Part|mode} is `arpeggio`.
   * @param {Object} options
   * @param {Number} [options.min=0] minimum possible value (inclusive)
   * @param {Number} [options.max=2] maximum possible value (inclusive)
   */
  static *pitch({ min=0, max=2 }={}) {
    const range = max - min + 1; // + 1 includes the max value
    while (true) yield Math.floor(min + range*Math.random());
  }

  /**
   * Randomly yield a floating point number suitable for intensity values in a {@link Rhythm}.
   * @param {Object} options
   * @param {Number} [options.min=0] minimum possible value (inclusive)
   * @param {Number} [options.max=1] maximum possible value (exclusive)
   */
  static *intensity({ min=0, max=1 }={}) {
    const range = max - min;
    while (true) yield min + range*Math.random();
  }

  /**
   * Randomly yield an integer suitable for durations values in a {@link Rhythm}.
   *
   * First a random integer value between `min` and `max` is calculated, then it's multiplied by the `multiplier`.
   *
   * NOTE: Random durations are currently *not* supported by Harmony.durations or Rhythm.pattern.
   * @param {Object} options
   * @param {Number} [options.min=1] minimum possible value (inclusive)
   * @param {Number} [options.max=4] maximum possible value (inclusive)
   * @param {Number} [options.multiplier=1] scales the random value
   */
  static *duration({ min=1, max=4, multiplier=1 }={}) {
    const range = max - min + 1; // + 1 includes the max value
    while (true) yield Math.floor(min + range*Math.random()) * multiplier;
  }

  /**
   * Randomly yield one of the given values.
   * @param {Array} choices the values to randomly yield
   */
  static *choice(choices) {
    const count = choices.length;
    while (true) yield choices[Math.floor(count*Math.random())];
  }

  /**
   * Randomly yield one of the given values with a probability distribution determined by the given weights.
   * @param {Array} choices the values to randomly yield
   * @param {Array} weights the relative weights for the corresponding values.
   * @example
   * weightedChoice([10,20,30], [1,2,1])
   * // 10 is yielded 25% of the time
   * // 20 is yielded 50% of the time
   * // 30 is yielded 25% of the time
   */
  static *weightedChoice(choices, weights) {
    const count = choices.length;
    const totalWeight = weights.reduce((a,b) => a + b, 0);
    while (true) {
      const target = totalWeight * Math.random();
      let i = 0;
      let sum = 0;
      while (i < count) {
        sum += (weights[i] || 0);
        if (sum >= target) break;
        i++;
      }
      yield choices[i];
    }
  }
}

var random = Random$1;

const { ARPEGGIO, BASS, CHORD, CHROMATIC, LEAD, SCALE } = part.MODES;

function evaluatePartMode(partMode, relativePitch, scale, chord, octave) {
  if (relativePitch instanceof Array) {
    return [].concat(...relativePitch.map(rp => evaluatePartMode(partMode, rp, scale, chord, octave)));
  }
  if (relativePitch instanceof pitch) {
    return [relativePitch];
  }
  if (relativePitch instanceof pitchClass) {
    return [new pitch(relativePitch, octave)];
  }
  if (!partMode) {
    return [Number(relativePitch)];
  }
  switch (partMode) {
    case ARPEGGIO:
      return [chord.pitch(relativePitch, { scale, octave })];

    case BASS:
      return [chord.pitch(0, { scale, octave, inversion: 0, offset: relativePitch })];

    case LEAD:
      return [chord.pitch(0, { scale, octave, offset: relativePitch })];

    case CHORD:
      return chord.pitches({ scale, octave, inversion: chord.inversion + relativePitch });

    case SCALE:
      return [scale.pitch(relativePitch, {octave})];

    case CHROMATIC:
      return [scale.pitch(0, { octave }).add(relativePitch)];

    default:
      console.error(`Unsupported part mode "${partMode}"`); // eslint-disable-line no-console
      return [];
  }
}

/**
 * A section of a {@link Song} with a particular scale and harmony.
 *
 * See the overview on the [documentation homepage](./index.html).
 * @implements [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
 */
class Section$1 {

  /**
   * @arg {Object} options
   * @arg {Harmony} options.harmony The Section's harmony (its chord progression)
   * @arg {Part[]|Object[]} options.parts The Section's parts as either an Array of {@link Part} objects,
   *              or an Array of options objects for the [Part constructor]{@link Part}
   * @arg {Scale} options.scale The Section's {@link Scale}.
   *                              Must be provided unless this instance is constructed by the containing {@link Song}
   *                              *and* it's [sectionLength]{@link Song} is set.
   * @arg {Number} [options.length=max {@link Part|Part.length}] The length of the Section in beats.
   */
  constructor({harmony: harmony$$1, scale, parts=[], length} = {}) {
    this.scale = scale;
    this.harmony = harmony$$1 instanceof harmony ? harmony$$1 : new harmony(harmony$$1);
    this.parts = parts.map((p,idx) => p instanceof part ? p : new part(Object.assign({channel:idx+1},p)));
    this.length = length || Math.max(...this.parts.map(p => p.length + p.delay));
  }

  /**
   * @function @@iterator
   * @memberOf Section
   * @instance
   * @description The `[Symbol.iterator]()` generator function* that implements the
   *              [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols|MDN: Iteration Protocols}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator|MDN: Symbol.iterator}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*|MDN: function*}
   */
  *[Symbol.iterator]() {
    const { scale, harmony: harmony$$1, parts } = this;
    for (const part$$1 of parts) {
      const {mode, channel, octave} = part$$1;
      let harmonyIter = harmony$$1[Symbol.iterator]();
      let harmonyCurr = harmonyIter.next();
      let harmonyNext = harmonyIter.next();
      for (const event of part$$1) {
        let { time, pitch: pitch$$1, duration, intensity } = event;
        if (time >= this.length) {
          // exceeded section length (we're assuming monotonically increasing times)
          break;
        }
        while (harmonyNext && harmonyNext.value && harmonyNext.value.time <= time) {
          harmonyCurr = harmonyNext;
          harmonyNext = harmonyIter.next();
        }
        const { value:{chord}={} } = harmonyCurr;
        const pitches = evaluatePartMode(mode, pitch$$1, scale, chord, octave).filter(p => p != null);
        const uniquePitchValues = new Set(pitches.map(p => Number(p)));
        for (const p of uniquePitchValues) {
          yield {time, note: {pitch: p, duration, intensity, channel} };
        }
      }
    }
  }
}

var section = Section$1;

const { noteJSON: noteJSON$1 } = utils;

/**
 * An object that generates entire songs.
 *
 * See the overview on the [documentation homepage](./index.html).
 * @implements [iterable protocol]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol}
 * @implements [toJSON()]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior}
 */
class Song$1 {

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
      s instanceof section ? s : new section(Object.assign({ scale, length: sectionLength }, s))
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
    for (const section$$1 of sections) {
      for (const event of section$$1) {
        yield noteJSON$1(event, timeOffset);
      }
      timeOffset += section$$1.length;
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

var song = Song$1;

/**
 * @module structure
 * @description
 * #### Objects that produce musical patterns which can be played or saved to a MIDI file.
 * - {@link Harmony}
 * - {@link Part}
 * - {@link Random}
 * - {@link Rhythm}
 * - {@link Section}
 * - {@link Song}
 */
var index$4 = { Harmony: harmony, Part: part, Random: random, Rhythm: rhythm, Section: section, Song: song };

const KEY_NAMES_BY_VALUE = Object.freeze({
  0: 'C',
  1: 'G',
  2: 'D',
  3: 'A',
  4: 'E',
  5: 'B',
  6: 'F#',
  7: 'C#',
  '-1': 'F',
  '-2': 'Bb',
  '-3': 'Eb',
  '-4': 'Ab',
  '-5': 'Db',
  '-6': 'Gb',
  '-7': 'Cb'
});

const KEY_VALUES_BY_NAME = {};
Object.keys(KEY_NAMES_BY_VALUE).forEach(value => {
  KEY_VALUES_BY_NAME[KEY_NAMES_BY_VALUE[value]] = value;
});
Object.freeze(KEY_VALUES_BY_NAME);

const byteConstants = {
  // Meta events
  SEQUENCE_NUMBER_BYTE: 0x00,
  TEXT_BYTE: 0x01,
  COPYRIGHT_BYTE: 0x02,
  SEQUENCE_NAME_BYTE: 0x03,
  INSTRUMENT_NAME_BYTE: 0x04,
  LYRICS_BYTE: 0x05,
  MARKER_BYTE: 0x06,
  CUE_POINT_BYTE: 0x07,
  CHANNEL_PREFIX_BYTE: 0x20,
  TRACK_END_BYTE: 0x2F,
  TEMPO_BYTE: 0x51,
  SMPTE_OFFSET_BYTE: 0x54,
  TIME_SIGNATURE_BYTE: 0x58,
  KEY_SIGNATURE_BYTE: 0x59,
  SEQUENCE_SPECIFIC_BYTE: 0x7F,

  // Channel events (messages)
  NOTE_OFF_BYTE: 0x80,
  NOTE_ON_BYTE: 0x90,
  NOTE_AFTERTOUCH_BYTE: 0xA0,
  CONTROLLER_BYTE: 0xB0,
  PROGRAM_CHANGE_BYTE: 0xC0,
  CHANNEL_AFTERTOUCH_BYTE: 0xD0,
  PITCH_BEND_BYTE: 0xE0,
};

const typeConstants = {};
const TYPES_BY_BYTE = {};
for (const byteConstantKey of Object.keys(byteConstants)) {
  const typeConstantKey = byteConstantKey.slice(0,-5); // remove _BYTE suffix
  const typeConstant = typeConstantKey.replace(/_/g,'-').toLowerCase();
  typeConstants[typeConstantKey] = typeConstant;
  TYPES_BY_BYTE[byteConstants[byteConstantKey]] = typeConstant;
}

var constants = Object.freeze(Object.assign({
  HEADER_CHUNK_ID: 0x4D546864, // "MThd"
  TRACK_CHUNK_ID: 0x4D54726B, // "MTrk"
  DEFAULT_DIVISION: 960,
  MICROSECONDS_PER_MINUTE: 60000000,
  // TODO: append _BYTE to names for consistency
  META_EVENT: 0xFF,
  SYSEX_EVENT: 0xF0,
  SYSEX_CHUNK: 0xF7, // a continuation of a normal SysEx event
  NOTE: 'note',
  TYPES_BY_BYTE,
  KEY_NAMES_BY_VALUE,
  KEY_VALUES_BY_NAME,
}, byteConstants, typeConstants));

class ByteScanner {

  constructor(arrayBuffer) {
    this.dataView = new DataView(arrayBuffer);
    this.position = 0; // the byte offset
  }

  uInt32() {
    const int32 = this.dataView.getUint32(this.position);
    this.position += 4;
    return int32;
  }

  uInt16() {
    const int16 = this.dataView.getUint16(this.position);
    this.position += 2;
    return int16;
  }

  uInt8() {
    const int8 = this.dataView.getUint8(this.position);
    this.position += 1;
    return int8;
  }

  variableLengthQuantity() {
    let data = 0;
    let byte = this.uInt8();
    while (byte & 0x80) {
      data = (data << 7) + (byte & 0x7F);
      byte = this.uInt8();
    }
    return (data << 7) + (byte & 0x7F);
  }

  backtrack(bytes) {
    this.position -= bytes;
  }

  position() {
    return this.position;
  }

  isBefore(offset) {
    return this.position < offset;
  }
}

var byteScanner = ByteScanner;

const { fractRound: fractRound$1 } = utils;

class MidiFileParser {

  constructor(arrayBuffer) {
    this.arrayBuffer = arrayBuffer;
  }

  toJSON() {
    this.next = new byteScanner(this.arrayBuffer);
    const header = this.readHeader();
    if (header.division & 0x8000) throw new Error('SMPTE time division format not supported');
    this.ticksPerBeat = header.division;

    const tracks = [];
    for (let i=0; i<header.ntracks; i++) {
      this.trackNumber = i + 1;
      tracks.push(this.readTrack());
    }

    // TODO: convert header to bpm
    return {
      header,
      tracks,
    }
  }

  readHeader() {
    if (this.next.uInt32() !== constants.HEADER_CHUNK_ID) throw new Error('MIDI format error: Invalid header chuck ID');
    const headerSize = this.next.uInt32();
    if (headerSize < 6) throw new Error('Invalid MIDI file: header must be at least 6 bytes');

    const format = this.next.uInt16();
    const ntracks = this.next.uInt16(); // number of tracks
    const division = this.next.uInt16();

    // ignore extra header bytes
    for (let i=6; i<headerSize; i++) this.next.uInt8();

    return {
      format,
      ntracks,
      division,
    }
  }

  readTrack() {
    if (this.next.uInt32() !== constants.TRACK_CHUNK_ID) throw new Error('MIDI format error: Invalid track chuck ID');

    const trackSize = this.next.uInt32();
    const track = [];
    this.timeInTicks = 0;
    this.notes = {};

    const end = this.next.position + trackSize;
    while (this.next.position < end) {
      const deltaTimeInTicks = this.next.variableLengthQuantity();
      this.timeInTicks += deltaTimeInTicks;

      const event = this.readEvent();
      // console.log(`at ${this.timeInTicks}, got ${JSON.stringify(event)}`);
      if (event) {
        let timeInTicks;
        if (event.timeInTicks == null) {
          timeInTicks = this.timeInTicks;
        } else {
          // special case for note on / note off pairs
          timeInTicks = event.timeInTicks;
          delete event.timeInTicks;
        }
        event.time = timeInTicks / this.ticksPerBeat;
        track.push(event);
      }
    }

    // TODO: warn about held notes (if DEBUG for this lib is enabled?)

    // Note events get inserted when we see their note off event, so note durations can lead to out-of-order-events:
    return track.sort((a, b) => a.time - b.time);
  }

  readEvent() {
    const eventType = this.next.uInt8();
    switch (eventType) {
      case constants.META_EVENT:
        return this.readMetaEvent();
      case constants.SYSEX_EVENT:
      case constants.SYSEX_CHUNK:
        throw new Error('Sysex not supported yet'); // TODO
      default:
        return this.readMessage(eventType);
    }
  }

  readMetaEvent() {
    const byte = this.next.uInt8();
    switch (byte) {
      case constants.SEQUENCE_NUMBER_BYTE:
        return {
          type: constants.SEQUENCE_NUMBER,
          number: this.readMetaValue()
        };
      case constants.TEXT_BYTE:
      case constants.COPYRIGHT_BYTE:
      case constants.SEQUENCE_NAME_BYTE:
      case constants.INSTRUMENT_NAME_BYTE:
      case constants.LYRICS_BYTE:
      case constants.MARKER_BYTE:
      case constants.CUE_POINT_BYTE:
        return {
          type: constants.TYPES_BY_BYTE[byte],
          text: this.readMetaText(),
        };
      case constants.CHANNEL_PREFIX_BYTE:
        return {
          type: constants.CHANNEL_PREFIX,
          channel: this.readMetaValue(),
        };
      case constants.TRACK_END_BYTE:
      case constants.SMPTE_OFFSET_BYTE:
      case constants.SEQUENCE_SPECIFIC_BYTE:
        return {
          type: constants.TYPES_BY_BYTE[byte],
          data: this.readMetaData(),
        };
      case constants.TEMPO_BYTE:
        return {
          type: constants.TEMPO,
          bpm: fractRound$1(constants.MICROSECONDS_PER_MINUTE / this.readMetaValue(), 3),
        };
      case constants.TIME_SIGNATURE_BYTE: {
        const [numerator, denominatorPower] = this.readMetaData();
        return {
          type: constants.TIME_SIGNATURE,
          numerator: numerator,
          denominator: Math.pow(2, denominatorPower)
        };
      }
      case constants.KEY_SIGNATURE_BYTE: {
        const [keyValue, scaleValue] = this.readMetaData();
        const key = constants.KEY_NAMES_BY_VALUE[keyValue] || `unknown ${keyValue}`;
        const scale = scaleValue === 0 ? 'major' : scaleValue === 1 ? 'minor' : `unknown ${scaleValue}`;
        return {
          type: constants.KEY_SIGNATURE,
          key: key,
          scale: scale,
        };
      }
      default:
        return {
          type: `unknown meta event 0x${byte.toString(16)}`,
          data: this.readMetaData(),
        };
    }
  }

  readMetaValue() {
    const length = this.next.variableLengthQuantity();
    let value = 0;
    for (let i=0; i<length; i++) {
      value = (value << 8) + this.next.uInt8();
    }
    return value;
  }

  readMetaText() {
    return String.fromCharCode(...this.readMetaData());
  }

  readMetaData() {
    const length = this.next.variableLengthQuantity();
    const data = [];
    for (let i=0; i<length; i++) {
      data.push(this.next.uInt8());
    }
    return data;
  }

  readMessage(eventType) {
    let type;
    let channel;
    if (eventType & 0x80) {
      type = this.messageType = eventType & 0xF0;
      channel = this.channel = (eventType & 0x0F) + 1;
    }
    else {
      // This is a running status byte, reuse type and channel from last message:
      type = this.messageType;
      channel = this.channel;
      // And the byte we thought was eventType is really the next data byte, so backtrack
      this.next.backtrack(1);
    }

    let event;
    switch(type) {
      case constants.NOTE_ON_BYTE:
        this.readNoteOn();
        return null; // note event will be created via corresponding note off
      case constants.NOTE_OFF_BYTE:
        event = this.readNoteOff();
        break;
      case constants.NOTE_AFTERTOUCH_BYTE:
        event = {
          type: constants.NOTE_AFTERTOUCH,
          pitch: this.next.uInt8(),
          value: this.next.uInt8(),
        };
        break;
      case constants.CONTROLLER_BYTE:
        event = {
          type: constants.CONTROLLER,
          number: this.next.uInt8(),
          value: this.next.uInt8(),
        };
        break;
      case constants.PROGRAM_CHANGE_BYTE:
        event = {
          type: constants.PROGRAM_CHANGE,
          number: this.next.uInt8(),
        };
        break;
      case constants.CHANNEL_AFTERTOUCH_BYTE:
        event = {
          type: constants.CHANNEL_AFTERTOUCH,
          value: this.next.uInt8(),
        };
        break;
      case constants.PITCH_BEND_BYTE:
        event = {
          type: constants.PITCH_BEND,
          value: (this.next.uInt8() << 7) + this.next.uInt8(),
        };
        break;
      default:
        // TODO: handle "system realtime messages", etc
        // TODO: I think the correct thing to do here is to keep
        // reading bytes until we get to the next one where (byte & 0x80) is truthy, then backtrack
        throw new Error(`ERROR: unexpected message ${type}`);
    }
    event.channel = channel;
    return event;
  }

  readNoteOn() {
    const pitch = this.next.uInt8();
    const velocity = this.next.uInt8();
    if (velocity === 0) {
      // handle as a note off without an off velocity
      this.readNoteOff(pitch);
    }
    else {
      if (this.notes[pitch]) {
        // TODO, support this case?
        console.log(`Warning: ignoring overlapping note on track number ${this.trackNumber} for pitch ${pitch}`); // eslint-disable-line no-console
      }
      else {
        this.notes[pitch] = [velocity, this.timeInTicks];
      }
    }
    return null; /// we'll create a "note" event when we see the corresponding note_off
  }

  readNoteOff(pitch) {
    let release;
    if (pitch == null) {
      pitch = this.next.uInt8();
      release = this.next.uInt8(); // AKA off velocity
    } // else pitch was passed in from readNoteOn() when a velocity of 0 was encountered

    if (this.notes[pitch]) {
      // const [velocity, startTime] = this.notes[pitch];
      const pitchData = this.notes[pitch];
      const velocity = pitchData[0];
      const startTime = pitchData[1];
      delete this.notes[pitch];
      const event = {
        type: constants.NOTE,
        pitch: pitch,
        velocity: velocity,
        duration: (this.timeInTicks - startTime) / this.ticksPerBeat,
      };
      if (release != null) event.release = release;
      event.timeInTicks = startTime; // special case, readTrack() should use this instead of it's time offset
      return event;
    }
    else console.log(`Warning: ignoring unmatched note off event on track ${this.trackNumber} for pitch ${pitch}`); // eslint-disable-line no-console
  }

}

var parser = MidiFileParser;

/*
 * A big-endian byte array that can write MIDI variable length values
 */
class ByteArray extends Array {
  writeInt32(int32) {
    this.push((int32 & 0xFF000000) >> 24);
    this.push((int32 & 0x00FF0000) >> 16);
    this.push((int32 & 0x0000FF00) >> 8);
    this.push((int32 & 0x000000FF));
  }

  writeInt24(int24) {
    this.push((int24 & 0xFF0000) >> 16);
    this.push((int24 & 0x00FF00) >> 8);
    this.push((int24 & 0x0000FF));
  }

  writeInt16(int16) {
    this.push((int16 & 0xFF00) >> 8);
    this.push((int16 & 0x00FF));
  }

  writeInt8(int8) {
    this.push(int8 & 0xFF);
  }

  writeVariableLengthQuantity(value) {
    if (value > 0x0FFFFFFF) {
      throw new Error(`Cannot write variable length quantity ${value} because it exceeds the maximum ${0x0FFFFFFF}`);
    }
    const buffer = [value & 0x7F];
    while (value >>= 7) { // eslint-disable-line no-cond-assign
      buffer.push((value & 0x7f) | 0x80);
    }
    for (let i = buffer.length - 1; i >= 0; i--) {
      this.push(buffer[i] & 0xFF);
    }
  }
}

var byteArray = ByteArray;

class MidiFileSerializer {

  constructor(midiJSON) {
    this.midiJSON = midiJSON;
  }

  toBuffer() {
    return new Buffer(this.toUint8Array());
  }

  toUint8Array() {
    const header = Object.assign({format: 1, division: constants.DEFAULT_DIVISION}, this.midiJSON.header);
    const bpm = this.midiJSON.bpm;
    const tracks = this.midiJSON.tracks;
    this.ticksPerBeat = header.division;
    header.ntracks = tracks.length;
    if (bpm) header.ntracks++;
    let bytes = new byteArray();

    bytes.writeInt32(constants.HEADER_CHUNK_ID);
    bytes.writeInt32(6);
    bytes.writeInt16(header.format);
    bytes.writeInt16(header.ntracks);
    bytes.writeInt16(header.division);

    if (bpm) {
      bytes = bytes.concat(this.trackBytes([{ type: constants.TEMPO, bpm: bpm }]));
    }
    for (const track of tracks) {
      bytes = bytes.concat(this.trackBytes(track));
    }
    return new Uint8Array(bytes);
  }

  trackBytes(rawTrack) {
    const track = this.normalizeNoteEvents(rawTrack);
    const bytes = new byteArray();
    let timeInTicks = 0;
    let nextTimeInTicks;
    let deltaTimeInTicks;
    for (const event of track) {
      nextTimeInTicks = Math.round(event.time * this.ticksPerBeat);
      deltaTimeInTicks = nextTimeInTicks - timeInTicks;
      timeInTicks = nextTimeInTicks;
      bytes.writeVariableLengthQuantity(deltaTimeInTicks);
      // console.log('writing event', event);
      const channelByte = (event.channel - 1) & 0x0F;
      switch (event.type) {
        case constants.NOTE_ON:
          bytes.writeInt8(constants.NOTE_ON_BYTE | channelByte);
          // TODO: I think we need a writeInt7 that does & 0x7F, for safety
          // Maybe we should clamp to 0,127 and/or issue a warning when value is out of range
          bytes.writeInt8(event.pitch);
          bytes.writeInt8(event.velocity); // TODO: might want to do Math.round here?
          break;
        case constants.NOTE_OFF:
          bytes.writeInt8(constants.NOTE_OFF_BYTE | channelByte);
          bytes.writeInt8(event.pitch);
          bytes.writeInt8(event.velocity);
          break;
        case constants.TRACK_END:
          bytes.writeInt8(constants.META_EVENT);
          bytes.writeInt8(constants.TRACK_END_BYTE);
          bytes.writeVariableLengthQuantity(0);
          break;
        case constants.TEMPO:
          bytes.writeInt8(constants.META_EVENT);
          bytes.writeInt8(constants.TEMPO_BYTE);
          bytes.writeVariableLengthQuantity(3);
          bytes.writeInt24(Math.round(constants.MICROSECONDS_PER_MINUTE / event.bpm));
          break;
        default:
          throw new Error(`Event type ${event.type} not supported yet`);
      }
    }

    const trackHeadBytes = new byteArray();
    trackHeadBytes.writeInt32(constants.TRACK_CHUNK_ID);
    trackHeadBytes.writeInt32(bytes.length);
    return trackHeadBytes.concat(bytes);
  }

  // split note events into note on and note off events
  normalizeNoteEvents(rawTrack) {
    const track = [];
    for (const event of rawTrack) {
      if (event.type === constants.NOTE) {
        track.push({
          time: event.time,
          type: constants.NOTE_ON,
          pitch: event.pitch,
          velocity: event.velocity,
          channel: event.channel,
        });
        track.push({
          time: event.time + event.duration,
          type: constants.NOTE_OFF,
          pitch: event.pitch,
          velocity: event.release || 0,
          channel: event.channel,
        });
      }
      else track.push(event);
    }
    return track.sort((a, b) => a.time - b.time);
  }

}

var serializer = MidiFileSerializer;

/* eslint-env browser */
var webUtils = {

  appendBytesToPage(byteArray) {
    document.body.appendChild(
      document.createTextNode(
        Array.from(byteArray).map(
          b => b.toString(16).toUpperCase()
        ).join(' ')
      )
    );
  },

  createDownloader() {
    const a = document.createElement('a');
    a.style = 'display: none';
    document.body.appendChild(a);
    return {
      download(byteArray, name) {
        const blob = new Blob([byteArray], {type: 'octet/stream'});
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    };
  }
};

// Same as index.js, but replaces Node.js-specific MIDI output code with just basic MIDI file support, and adds WebUtils
const { Chord, Pitch, PitchClass, RelativePitch, Scale } = index;
const { CHORDS, PITCH_CLASSES, PITCHES, SCALES } = index$2;
const { Harmony, Random, Rhythm, Section, Song, Part } = index$4;




var webEntry = {
  Chord, Pitch, PitchClass, RelativePitch, Scale,
  CHORDS, PITCH_CLASSES, PITCHES, SCALES,
  Harmony, Random, Rhythm, Section, Song, Part,
  MidiFileParser: parser, MidiFileSerializer: serializer, WebUtils: webUtils,
};

return webEntry;

}());
