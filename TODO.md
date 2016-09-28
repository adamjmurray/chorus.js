Features
- Convert all unique example behaviors to automated test cases
- Song defaults: sectionDuration, scale
- More scales
- Improve MIDI file support 
  - lots of little features are missing, plus error handling for semi-malformed input files could be improved / see MIDI specs
  - Multiple tracks/parts that use the same channel (for example when doing polyrhythms) should render to the same MIDI file track
- Maybe Rhythm should support Iterables for times, pitches, durations, intensities
  - Add a randomize Iterable class (input: min, max value)
- Live-coding mode:
  - Loop a section
  - Watch the Song source file for changes
  - Synchronize changes with section-looping
- Enhance output-selector:
  - Support writing to MIDI files
  - Allow an environment variable to set the port (or file)

Refactoring
- Stop using Rhythm in Harmony, since it doesn't need intensities or durations.
- Rename Track to Part? Especially since multiple "Tracks" may send to a single DAW track or MIDI file track.
  - Maybe Track should contain a list of Parts, but is the model getting too complicated? Just use channel for MIDI track number in this library?

Bugs
- Invert a Chord that doubles the octave can have strange behavior with shifts to the offsets.
  Ex: C major chord with octave doubling and a shift of 1 on the first note, so C#,E,G,C. First inversion => E,G,C,F instead of E,G,C,C#
- TODO above song.js toJSON()
- All notes off doesn't work for higher channels. It seems like it should. I wonder if we are overloading the MIDI port with too many messages? Try adding a MIDI monitor to Ableton Live to verify
  - Also having problems with this in Bitwig. Could be a MIDI rate-limiting issue? Maybe just try sending the "all notes off" CC message?
- The models with array properties aren't immutable. Try testing push()ing something onto scale/chord
- require('./helpers/select-output') causes process to hang if you don't actually select an output

Maybe
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
