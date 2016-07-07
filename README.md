TODO:
- Introduce idea of sections to Song, for different scales/chord progressions
  - Needs to set a length.
  - Tracks should have an option to loop or do a "one shot"
  - Tracks should have a start time offset
  - Harmony should have an option to loop or do a "one shot" (last chord continues until the end of the section)
- Different track follow modes: scale, chords, harmony (all notes in chords), chromatic...
- Drum tracks should be able to specify a single pitch to use
  - Just set the pitches property to something like [C4]? Melodies should work with pitches and not just Numbers...
- Melody might need defaultDuration, defaultIntensity options? Or event durations/intensities Arrays?
- Maybe Rhythm (and Melody?) should supoort Iterables for times, pitches, durations, intensities, so we can use
  the Pattern classes for this stuff! They would need to detect end-of-iteration and restart though (potentially depending on other options).
  - Maybe introduce a LoopingIterable helper class?
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?

Refactoring:
- The Song class should not take a generator. Instead it should be an Iterator (and/or have a toJSON() -> to MIDI JSON)
  and work with both the realtime MIDI playback and the MIDI file output
- For chord names, I want to do TRIAD[0] instead of TRIAD.at(0).
- For chord names, I want to do TRIAD[4].inv(-1) to invert it. We need "lazy" inversions because
  we have not yet assigned a scale.
- For scale names, I want to do HARMONIC_MINOR[C] or HARMONIC_MINOR.C
- I don't like how we have to set chord.scale in Harmony.
  Let's have the containing class (Song, or Section whenever we introduce that) hold the scale
  and apply it when evaluating the pitch.

Misc:
- Euclidean Sequencer / Pattern
  - In general, provide pluggable "strategies" for sequencing in a Song

Focus:
- Defer working on the custom syntax until the core system can product a whole song.
Maybe that should be a separate project.
- Potentially strip down the core model too. Not sure we need a note class? The important thing
is it's easy to use realtime midi or generate midi files.
- Not sure about keeping the patterns, although they may be useful as Song constructs? See feature idea above about
 pluggable "strategies" for sequencing

