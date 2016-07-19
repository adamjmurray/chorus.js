TODO:
- See the FIXME comment in Chord
- Octave settings for tracks
  (microtonal support? lazy evaluate based on scale length! See chord.pitch() for example of proper microtonal support)
- Better console.log() behavior for Pitch and PitchClass
- Enhance Section behavior
  - Needs to set a length.
  - Tracks should have an option to loop or do a "one shot"
  - Tracks should have a start time offset option
  - Harmony should have an option to loop or do a "one shot" (last chord continues until the end of the section)
- Chord features:
  - Add a bass note below the chord.
    So for example, TRIAD[5].bass(C) could result in C,E,A or maybe C,A,C(,E?).
    This starts getting into the territory of wanting to control the spacing/openess of the chord
    At some point the user probably just needs to construct a custom chord?
- All notes off doesn't work for higher channels. It seems like it should. I wonder if we are overloading the MIDI port with too many messages? Try adding a MIDI monitor to Ableton Live to verify
- Melody might need defaultDuration, defaultIntensity options? Or event durations/intensities Arrays?
- Melodies should work with Pitches/PitchClasses and not just Numbers (for chromatic embellishments)
- Maybe Rhythm (and Melody?) should supoort Iterables for times, pitches, durations, intensities, so we can use
  the Pattern classes for this stuff! They would need to detect end-of-iteration and restart though (potentially depending on other options).
  - Maybe introduce a LoopingIterable helper class?
- Improve MIDI file support (lots of little features are missing, plus error handling for semi-malformed input files could be improved / see MIDI specs)
- Euclidean Pattern
- Support melodic sequences (as in the music theory kind of sequence), where the same relative pitch patterns are repeated by starting at different scale (or chord?) degrees
- It kind of sucks midiJSON keys get converted to strings, and don't necessarily maintain their order correctly when printing

  Let's do this:

      "tracks": [
        [ // each event listed individually and with it's time
          {
            "time": 0,
            "type": "note",
            ...
          },
          {
            "time": 0,
            "type": "note",
            ...
          }
        ],
        [ ... track 2 ... ]
      ]

Maybe?
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?
