TODO:
- Enhance Section behavior
  - Needs to set a length.
  - Tracks should have an option to loop or do a "one shot"
  - Tracks should have a start time offset option
  - Harmony should have an option to loop or do a "one shot" (last chord continues until the end of the section)
- New track mode 'chord-root' (better name?). Ignores inversion or is somehow relative to the root of the chord.
  - In this mode, we might want the pitch numbers to follow the scale vs the chord. This could be different modes. 
    I am wondering if track.type should be split into different options, though, like "follow" and "constraint" (or keep "type" but add "follow")?
  - Meh, these ideas are probably too complicated. Maybe just add track mode 'bass', which follows the chord roots and is constrained to the scale.
- Chord features:
  - Add a bass note below the chord.
    So for example, in C MAJOR, TRIAD(5,{bass:C}) could result in C,E,A or maybe C,A,C(,E?)
    This starts getting into the territory of wanting to control the spacing/openess of the chord
    At some point the user probably just needs to construct a custom chord?
    Another idea is a more generic {add:[offsets]} option that can add some addition offsets (probably only supported in the CHORDS functions)
- All notes off doesn't work for higher channels. It seems like it should. I wonder if we are overloading the MIDI port with too many messages? Try adding a MIDI monitor to Ableton Live to verify
- Track might need defaultDuration, defaultIntensity options? Or event durations/intensities Arrays?
- Maybe Rhythm should support Iterables for times, pitches, durations, intensities, so we can use
  the Pattern classes for this stuff! They would need to detect end-of-iteration and restart though (potentially depending on other options).
  - Maybe introduce a LoopingIterable helper class?
- Improve MIDI file support (lots of little features are missing, plus error handling for semi-malformed input files could be improved / see MIDI specs)
- Euclidean Pattern
- Support melodic sequences (as in the music theory kind of sequence), where the same relative pitch patterns are repeated by starting at different scale (or chord?) degrees
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
