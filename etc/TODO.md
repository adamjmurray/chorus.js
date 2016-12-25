Cleanup
- MIDIOut.play() should just convert Song objects toJSON() and have a single code path (need more test coverage) 
  - I think MIDIOut.play() just needs to operate off the JSON format and not worry about iterators
  - And Song[Symbol.iterator()] and Song.toJSON() should reuse more code (toJSON can rely on the iterator)

Improve Test Coverage
- microtonal support (pitchesPerOctave, pitchValueOffset in PitchClass, Pitch, Scale)
- Test that a Part's channel determines the track for MIDI file output, especially:
  - Multiple Part's with the same channel
  - Gaps in the channel (e.g. track 1 is channel 1, track 2 is channel 3)
- section length when it's calculated from part length + delay

Documentation
- Document Chord, Scale, RelativePitch thoroughly
- Move structure diagram into a tutorial doc? Organize non-module/class docs into tutorial files. 
  Each documented DAW setup should go into it's own tutorial
- Walkthrough Guide:
  - Songs with no part modes (just use numbers, and then pitch name constants)
    - selecting an output, playing in realtime vs file output
  - scales and scale mode
  - harmony and chord/arpeggio modes
  - lead and bass modes
  - multiple parts
  - multiple sections
  - simultaneous notes
  - non-scale pitches (chords and relative pitches with shifts)
  - microtonal features
    - Maybe include a .tun file generator?
  - low-level guide (maybe later?)
    - interactive playback with MidiOut
    - scheduling
- Double check my install/usage notes on Windows
- Ableton Live instructions
- Bitwig instructions need to explain per-channel setup via Toms_Bitwig_Scripts
- Other DAWS? PreSonus Studio One (has a free version), Garage Band, Logic (maybe later) 
- Setup a Changelog file
  

*** v1.0.0 Release ***


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
- Constrain track range. Since bass mode ignores inversions, it can jump up too much. Sometimes it should go down an octave.
- Robust Midi file parsing (error handling for semi-malformed input files could be improved / see MIDI specs)
  - Not particularly useful until we can parse MIDI files into a Song object, and then do things like transform 
    the scale and chord progression.    
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
- Random timing (not just durations)
  This simply doesn't work with the way we are calculating the times list in Rhythm & Harmony constructors right now.
- node-midi has a problem with reusing IO objects: https://github.com/justinlatimer/node-midi/issues/112
  This could be dealt with in the MIDIIn and MIDIOut classes. Doesn't seem urgent.
- Improve MIDI file support
  - bpm/tempo support
    - when reading files (set to the bpm setting in the top-level JSON for consistency with how we write files)
    