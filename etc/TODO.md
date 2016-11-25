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
- Document Chord, Scale, RelativePitch thoroughly
- Move structure diagram into a tutorial doc? Organize non-module/class docs into tutorial files. 
  Each documented DAW setup should go into it's own tutorial
- Double check my install/usage notes on Windows
- Ableton Live instructions
- Bitwig instructions need to explain per-channel setup via Toms_Bitwig_Scripts
- Other DAWS? PreSonus Studio One (has a free version), Garage Band, Logic (maybe later) 
- Setup a Changelog file
  
Cleanup
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