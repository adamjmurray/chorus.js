TODO:
- Convert Songs to MIDI files
- Enhance Section behavior
  - Needs to set a length.
  - Tracks should have an option to loop or do a "one shot"
  - Tracks should have a start time offset option
  - Harmony should have an option to loop or do a "one shot" (last chord continues until the end of the section)
- Different track follow modes: scale, chords, harmony (all notes in chords), chromatic...
- Drum tracks should be able to specify a single pitch to use
  - Just set the pitches property to something like [C4]? Melodies should work with pitches and not just Numbers...
- Melody might need defaultDuration, defaultIntensity options? Or event durations/intensities Arrays?
- Maybe Rhythm (and Melody?) should supoort Iterables for times, pitches, durations, intensities, so we can use
  the Pattern classes for this stuff! They would need to detect end-of-iteration and restart though (potentially depending on other options).
  - Maybe introduce a LoopingIterable helper class?
- Euclidean Sequencer / Pattern
  - In general, provide pluggable "strategies" for sequencing in a Song
- Support melodic sequencers, where the same relative pitch patterns are repeated by starting at different scale (or chord?) degrees
- It kind of sucks midiJSON keys get converted to strings, and don't necessarily maintain their order correctly when printing
  Maybe we should do something like:

      "tracks": [
        [
          {
            "time": 0,
            "events": [
              {
                "type": "note",
                ...
              }
            ]
          },
          {
            "time": 0.5,
            "events": [...]
          }
        ],
        [ ... track 2 ... ]
      ]

  Alternately:

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

Refactoring:
- For chord names, I want to do TRIAD[0] instead of TRIAD.at(0).
- For chord names, I want to do TRIAD[4].inv(-1) to invert it. We need "lazy" inversions because
  we have not yet assigned a scale.
- For scale names, I want to do HARMONIC_MINOR[C] or HARMONIC_MINOR.C
- I don't like how we have to set chord.scale in Harmony.
  Let's have the containing class (Song, or Section whenever we introduce that) hold the scale
  and apply it when evaluating the pitch.

Maybe?
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?

Focus:
Before going crazy deleting stuff, put it in a branch?
- Defer working on the custom syntax until the core system can product a whole song.
Maybe that should be a separate project.
- Potentially strip down the core model too. Not sure we need an intensity or duration class? The important thing
is it's easy to use realtime midi or generate midi files.
- Not sure about keeping the patterns, although they may be useful as Song constructs? See feature idea above about
 pluggable "strategies" for sequencing

