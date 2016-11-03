TODO next:
- Write a bunch of tests related to the non-12-pitches-per-octave behaviors introduced in pitch, pitchClass, scale (see relevant commit diff)
- See TODO in Pitch constructor related to setting a pitch value offset in microtonal tunings     

Bugs
- Notes are running into each other beings things are "100% legato". For example when I was testing the 19tet example and recording live MIDI to Ableton.
  Maybe we can ensure the note offs come before note ons (could be issues with the scheduler?). Otherwise need some way to deal with this.
  A quick hack solution would be to have a legato option (relative duration? not sure what to call it) in Part, and maybe a default in Song.
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
- Improve MIDI file support
  - A Part's channel should determine track for MIDI file output
    - Default the part.channel to it's index within the section, at construction time (instead of deferring this logic to Section @@iterator) 
  - bpm/tempo support
  - other missing core features?
  - error handling for semi-malformed input files could be improved / see MIDI specs
- Iterables for randomization (input: min, max value, integer vs float mode), for use as intensities, durations, etc
  - More iterable patterns, like weighted choice  
- Documentation

Cleanup
- Renamed generators to structure? It keeps bothering me this term is overloaded with ES6 generator functions
- Rhythm construction is inconsistent with the other classes in that module (see looped rhythm example, why do we have to construct a Rhythm explicitly?).
  Probably everything should be passed in via an options object (and we can still have a special case for a String value + rate option, maybe?)
- Re-evaluate if everything in chord should be optionally overridden by the classes non-constructor functions.
  I'd argue for simplifying as much as possible for 1.0 if it's not needed by the Song generator logic.
- Rename github repo to chorus.js (assuming I don't come up with a better name). Leave the old page there and redirect.
- Provide constants for the part modes

Future Features
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
