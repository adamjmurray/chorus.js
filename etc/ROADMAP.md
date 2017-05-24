Documentation
- Harmony Tutorial
- Structure Tutorial
- Advanced Features Tutorial
- Microtonality Tutorial

Improve Test Coverage
- test the examples
- microtonal support (pitchesPerOctave, pitchValueOffset in PitchClass, Pitch, Scale)
- Test that a Part's channel determines the track for MIDI file output, especially:
  - Multiple Part's with the same channel
  - Gaps in the channel (e.g. track 1 is channel 1, track 2 is channel 3)
- section length when it's calculated from part length + delay

Future Features
- Chord spacing 
  - Chord#spread(): move every other note up an octave+ 
  - Chord#collapse(): remove spacing
- Tempo changes
  - Can bpm in MIDI JSON (i.e. Song.toJSON()) just be a track event in the first track? 
    Could make tempo changes easier?
    I think the first track is supposed to just be a control track, so might want to adjust that too
- Web support
  - Ideally support real-time MIDI with the Web MIDI API, but browser support is lacking right now
  - Support MIDI file download as a fallback
  - Direct audio output with the Web Audio API (this could really lower the barrier to microtonal composition)
- Constrain track range. Since bass mode ignores inversions, it can jump up too much. Sometimes it should go down an octave.
- Support custom names for PitchClasses and Pitches when pitchesPerOctave != 12
- Live-coding mode:
  - Loop a section
  - Watch the Song source file for changes
  - Synchronize changes with section-looping
- Improve MIDI file support
  - bpm/tempo support
    - when reading files (set to the bpm setting in the top-level JSON for consistency with how we write files)
  - Robust Midi file parsing (error handling for semi-malformed input files could be improved / see MIDI specs)
    - Not particularly useful until we can parse MIDI files into a Song object, and then do things like transform 
      the scale and chord progression.    
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
- Random timing (not just durations)
  This simply doesn't work with the way we are calculating the times list in Rhythm & Harmony constructors right now.
- node-midi has a problem with reusing IO objects: https://github.com/justinlatimer/node-midi/issues/112
  This could be dealt with in the MIDIIn and MIDIOut classes. Doesn't seem urgent.
    