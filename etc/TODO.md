Rework handling of relative pitches, which represent a pitch relative to a given scale
- Relative pitches can be either Numbers (representing 0-indexed scale degrees with wrap-around) 
  or {degree:Number, shift:Number} objects to support accidentals.
- Scale.pitch()'s input is a relative pitch  
- Chords should be modeled in terms of a list of relative pitches. 
  - Chord.constructor(relativePitches, { inversion = 0 } = {})
    - This way the root is the first relative pitch, so the CHORDS functions will add an offset to each relative pitch rather than change the root.
  - Chord.pitch()/pitches() functions return a list of relative pitches (so basically they just evaluate inversions)
- Test case
const chord = new Chord([{degree:1, shift:-1},3,5])
chord.pitch(0) => {degree:1, shift:-1}
(C_MIN)scale.pitch(chord.pitch(0)) => Db4
(C_MIN)scale.pitch(chord.pitch(1)) => F4
(C_MIN)scale.pitch(chord.pitch(0) + 1) => Eb4 
^ the shift is lost when we add - but how can this be implemented? 
If valueOf() {degree/shift} is just degree, maybe the structure classes can add this function?

1.0 Features
- Pitch value offsets for microtonal tunings (i.e. Don't always count pitch numbers from 0. See TODO in Pitch constructor) 
- Multiple notes at once. Should work intuitively in most part modes. For chord mode, take the union of the resulting pitches.
- Improve MIDI file support
  - A Part's channel should determine track for MIDI file output
    - Default the part.channel to it's index within the section, at construction time (instead of deferring this logic to Section @@iterator) 
  - bpm/tempo support
  - other missing core features? Worry about comprehensive input file support later?
  - error handling for semi-malformed input files could be improved / see MIDI specs
    What's the point of MIDI input right now? It doesn't really add anything to this library until we can parse
    MIDI into a Song object and then do things like transform the scale and chord progression.
    Deprioritize until I need it or someone asks for it...

Documentation
- Document Chord
- Move structure diagram into a tutorial doc? Organize non-module/class docs into tutorial files. 
  Each documented DAW setup should go into it's own tutorial
- Double check my install/usage notes on Windows
- Ableton Live instructions
- Bitwig instructions need to explain per-channel setup via Toms_Bitwig_Scripts
- Other DAWS? PreSonus Studio One (has a free version), Garage Band, Logic (maybe later) 
- Setup a Changelog file
  
Cleanup
- Rename scale.pitch() to scale.pitchAt()
- Rename chord.pitches() to chord.relativePitches()
- Rename chord.pitch() to chord.relativePitchAt()
- node-midi has a problem with reusing IO objects: https://github.com/justinlatimer/node-midi/issues/112
  This could be dealt with in the MIDIIn and MIDIOut classes. Doesn't seem urgent.
- MIDIOut.play() should just convert Song objects toJSON() and have a single code path (need more test coverage)  
- Drum constants should probably be Pitch objects

Once I do all the above, then we're at v1.0.0?

Future Features
- Tempo changes
- Support custom names for PitchClasses and Pitches when pitchesPerOctave != 12
- Live-coding mode:
  - Loop a section
  - Watch the Song source file for changes
  - Synchronize changes with section-looping
- Web support
  - Ideally support realtime MIDI with the Web MIDI API, but browser support is lacking right now
  - Support MIDI file download as a fallback
  - Direct audio output with the Web Audio API (this could really lower the barrier to microtonal composition)
- Constrain track range. Since bass mode ignores inversions, it can jump up too much. Sometimes it should go down an octave. See also next idea:
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
- Random timing (not just durations)
  This simply doesn't work with the way we are calculating the times list in Rhythm & Harmony constructors right now.