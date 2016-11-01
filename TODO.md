Features
- Enhance output-selector:
  - Support writing to MIDI files
  - Allow an environment variable to set the port (or file)
- Improve MIDI file support
  - A Part's channel should determine track for MIDI file output
  - bpm/tempo support
  - other missing core features?
  - error handling for semi-malformed input files could be improved / see MIDI specs
- Iterables for randomization (input: min, max value, integer vs float mode), for use as intensities, durations, etc
  - More iterable patterns, like weighted choice
- Live-coding mode:
  - Loop a section
  - Watch the Song source file for changes
  - Synchronize changes with section-looping

Refactoring
- SCALES[type] should be a function for consistency with CHORDS[type]
  - Especially because it assumes the chromatic scale (i.e. how can we define 19-tet scales this way?)
  
Bugs
- Invert a Chord that doubles the octave can have strange behavior with shifts to the offsets.
  Ex: C major chord with octave doubling and a shift of 1 on the first note, so C#,E,G,C. First inversion => E,G,C,F instead of E,G,C,C#
- All notes off doesn't work for higher channels. It seems like it should. I wonder if we are overloading the MIDI port with too many messages? Try adding a MIDI monitor to Ableton Live to verify
  - Also having problems with this in Bitwig. Could be a MIDI rate-limiting issue? Maybe just try sending the "all notes off" CC message?
- The models with array properties aren't immutable. Try testing push()ing something onto scale/chord

Maybe
- Instead of forcing a track into chromatic mode (which is hard to work with because it's not relative to the chords)
  I keep having this idea that floating point numbers could be used for accidentals (e.g. 0.5 is a half step above the
  scale root in scale mode). There seem to be a lot of messy edge cases (consider microtonal scales), but rounding to
  the nearest pitch value might work ok?
  - Alternately it may be interesting to support an "accidentals" ("offsets"?) array that can shift the pitch, and like
    most aspects of this library can be a differing length from the pitch list.
- Constrain track range. Since bass mode ignores inversions, it can jump up too much. Sometimes it should go down an octave. See also next idea:
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
