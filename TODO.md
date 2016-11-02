Bugs
- All notes off doesn't work for higher channels. It seems like it should. I wonder if we are overloading the MIDI port with too many messages? Try adding a MIDI monitor to Ableton Live to verify
  - Also having problems with this in Bitwig. Could be a MIDI rate-limiting issue? Maybe just try sending the "all notes off" CC message?

1.0 Features
- Better handling of accidentals (AKA chromatic "shifts")
  - See the private functions at the top of chord.js. This [offset,shift] duple list was the best way I could find to fix
    a bug related to inverting chords with shifts and octave doublings. I've also been struggling with how to model
    accidentals (AKA chromatic "shifts" as they are currently called in chords.js). Some ideas involved floating point numbers (messy)
    or separates lists of shifts (as we are using in the public interface of chords). Now I think letting a chord "offset" be
    either a Number or one of these [offset,shift] duples is the way to go. So expanding on this idea:
    - Is there a better name for [offset,shift] (semi-related, the additional offset you can apply in chord.pitches is confusing)
    - Shifts doesn't need to be part of the chord.pitch() and chord.pitches() interface if we fold into the offsets list, 
      which simplifies things
    - scale.pitch could accept() this duple and apply the chromatic shift to the base result
    - Any pitch list in the generators module (SOng, etc) should allow this duple in place of a Number
- Support for scales with more than 12 pitches per octave. 
  - Scales take a root pitch class, but pitch classes operate on mod 12 logic, so this interferes with e.g. working in 19-TET
  - One option may be to let PitchClass (and Scale?) take in an option to override the mod 12 value.
    This needs to work consistently end-to-end with the Song generator and related classes. 
- Improve MIDI file support
  - A Part's channel should determine track for MIDI file output
  - bpm/tempo support
  - other missing core features?
  - error handling for semi-malformed input files could be improved / see MIDI specs
- Iterables for randomization (input: min, max value, integer vs float mode), for use as intensities, durations, etc
  - More iterable patterns, like weighted choice  
- Documentation

Cleanup
- Re-evaluate if everything in chord should be optionally overridden by the classes non-constructor functions.
  I'd argue for simplifying as much as possible for 1.0 if it's not needed by the Song generator logic.

Future Features
- Live-coding mode:
  - Loop a section
  - Watch the Song source file for changes
  - Synchronize changes with section-looping
- Constrain track range. Since bass mode ignores inversions, it can jump up too much. Sometimes it should go down an octave. See also next idea:
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
