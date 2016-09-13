Features
- Rest behavior in Rhythms (negative numbers?). I guess this shouldn't "consume" pitches in the track (0 intensity could be used for that instead?)
  - -Infinity could mean "no more events" when looping
- Looping behavior for Rhythm times/durations/intensities
- Song defaults: sectionDuration, scale
- More scales
- Improve MIDI file support 
  - lots of little features are missing, plus error handling for semi-malformed input files could be improved / see MIDI specs
  - Multiple tracks/parts that use the same channel (for example when doing polyrhythms) should render to the same MIDI file track

Refactoring
- Stop using Rhythm in Harmony, since it doesn't need intensities or durations.
- Rename Track to Part? Especially since multiple "Tracks" may send to a single DAW track or MIDI file track.
  - Maybe Track should contain a list of Parts, but is the model getting too complicated? Just use channel for MIDI track number in this library?

TESTS!

Bugs
- TODO above song.js toJSON()
- All notes off doesn't work for higher channels. It seems like it should. I wonder if we are overloading the MIDI port with too many messages? Try adding a MIDI monitor to Ableton Live to verify
  - Also having problems with this in Bitwig. Could be a MIDI rate-limiting issue? Maybe just try sending the "all notes off" CC message?
- The models with array properties aren't immutable. Try testing push()ing something onto scale/chord

Maybe
- chord.add(offsets, {shifts}) to add additional notes to a chord
  - maybe a way to add a specific pitch/pitch class below the chord (add a bass)?
- Support melodic sequences (as in the music theory kind of sequence), where the same relative pitch patterns are repeated by starting at different scale (or chord?) degrees
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
- Maybe Rhythm should support Iterables for times, pitches, durations, intensities, so we can use
  the Pattern classes for this stuff! They would need to detect end-of-iteration and restart though (potentially depending on other options).
  - Now I'm not even sure the Pattern classes belong in this library. Although the random class could be nice...
