Bugs
- Section[Symbol.iterator] blows up when parts contains an empty Part (i.e. parts:[new Part()])  

1.0 Features
- Pitch value offsets for micortonal tunings (i.e. Don't always count pitch numbers from 0. See TODO in Pitch constructor) 
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
    - Any pitch list in the structure module (Song, etc) should allow this duple in place of a Number
- Improve MIDI file support
  - A Part's channel should determine track for MIDI file output
    - Default the part.channel to it's index within the section, at construction time (instead of deferring this logic to Section @@iterator) 
  - bpm/tempo support
  - other missing core features? Worry about comprehensive input file support later?
  - error handling for semi-malformed input files could be improved / see MIDI specs
- Iterables for randomization (input: min, max value, integer vs float mode), for use as intensities, durations, etc
  - More iterable patterns, like weighted choice  
- Documentation
  - Double check my install/usage notes on Windows
  - Ableton Live instructions
  - Bitwig instructions need to explain per-channel setup via Toms_Bitwig_Scripts
  - Other DAWS? PreSonus Studio One (has a free version), Garage Band, Logic (maybe later) 
  - Setup a Changelog file
  
Cleanup
- "rate" is the wrong name. Rates get faster when their values are higher, Part.rate/etc is the inverse
- Rhythm construction is inconsistent with the other classes in that module (see looped rhythm example, why do we have to construct a Rhythm explicitly?).
  Probably everything should be passed in via an options object (and we can still have a special case for a String value + rate option, maybe?)
- Re-evaluate if everything in chord should be optionally overridden by the classes non-constructor functions.
  I'd argue for simplifying as much as possible for 1.0 if it's not needed by the Song generator logic.
- node-midi has a problem with reusing IO objects: https://github.com/justinlatimer/node-midi/issues/112
  This could be dealt with in the MIDIIn and MIDIOut classes. Doesn't seem urgent.
- MIDIOut.play() should just convert Song objects toJSON() and have a single code path (need more test coverage)  

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
