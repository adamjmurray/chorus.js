- [Tempo](#tempo)
- [Time Lists](#time-lists)
- [Rests](#rests)
- [Durations](#durations)
- [Intensities](#intensities)
- [Rhythm Strings](#rhythm-strings)
- [Euclidean Rhythms](#euclidean-rhythms)
- [Using Drums](#using-drums)
- [Next Steps](#next-steps)


<a name="tempo"></a>
## Tempo

When we don't specify a rhythm, each note is a single beat. How fast is a beat?

The song's tempo determines how fast or slow a song plays. It is specified in terms of **beats per minute**, or `bpm` 
for short. The default bpm is 120, which is 2 beats every second. Taking the example from the 
[Quick Start Guide](./index.html#quick-start-guide), let's make it play faster by increasing the bpm:

{@example 03-tempo}

Currently a single bpm is used for the entire song (support for tempo changes within a Song may be added in the future).

Try changing the bpm to be faster and slower.


<a name="time-lists"></a>
## Time Lists

As we've seen, a song part plays notes by specifying `pitches` to play.

Every song part has a `rhythm` to control the timing of the notes. The default `rhythm` plays a note on every beat.

One way of specifying `rhythm` is with a "time list", which is the list of durations for each note. As soon
as one note is done, the next note will immediately play. For example:

{@example 03-time-lists}

This plays the pitch C4 for 1 beat, D4 for half a beat, E4 for half a beat, F4 for 2 beats, and so on.


<a name="rests"></a>
## Rests

When using time lists, the next note plays as soon as the previous note ends.
Sometimes, especially with sustained sounds, we don't want the notes to bump up against each other.

Rests allow us to create space between the notes. A rest is specified by a negative numbers in a time list.
The duration of the rest is its absolute value, so `-2` is a rest for 2 beats.

This example plays a note on every beat, but the duration changes each time. Rests are used to keep the
notes paying on each beat.

NOTE: To hear this example properly, use a sustained sound like strings, organs, or pads.

{@example 03-rests}

The spacing in the pitches list is there just to show how the notes line up with the rhythm.


<a name="durations"></a>
## Durations

Note durations can be given directly instead of using negative time values for rests. Duration values are in
beats just like with time lists.

To do this, we need to give a rhythm object with multiple properties instead of just a time list. 
When we set a time list using `rhythm: [...]` that's shorthand for `rhythm: { pattern: [...] }`.
The rhythm object supports several other properties including `durations`, which we use like this:

{@example 03-durations}

This plays a note every beat (because the `rhythm.pattern` is `[1, 1, 1, ...]`), but the durations of the notes
are different. The first few notes are 1/2 of a beat, 1/4 of a beat, and 0.05 of a beat. This is similar to the previous
example on rests. But durations can also go longer than the rhythm.pattern timing. The last few notes of this example
stack up a chord of simultaneous notes that start at different times. 


<a name="intensities"></a>
## Intensities

Along with durations, we can set intensities in the rhythm object to control the loudness (AKA MIDI velocity) of the
notes being played. Intensities go from 0.0 to 1.0:

{@example 03-intensities}

This plays a series of notes where every note is louder than the one before. The last note is at maximum loudness.

NOTE: Whatever is receiving the MIDI output from chorus.js must be velocity-sensitive for intensities
to have any effect. If you don't hear a difference in loudness, check your synthesizer/sampler settings or use
a different instrument.


<a name="rhythm-strings"></a>
## Rhythm Strings

We can combine timing and intensities into a convenient "rhythm string" format.
When a part's rhythm is a string, it can contain the following characters:

`"X"` → accented (louder) note <br>
`"x"` → normal loudness note <br>
`"="` → tie (continue holding previous note) <br>
`"."` → rest (stop previous note) <br>

Other characters are ignored and can be used to improve readability, for example `"X.x.x==...x=x=X="` 
can be written as `"X.x.|x==.|..x=|x=X="` to visually organize the rhythm into groups of 4 beats. For example:

{@example 03-rhythm-string}

This plays a louder C4 for one beat, a D4 for one beat, an E4 for one beat, a rest for one beat, a louder D4
for one beat, and so on.

If you want to use rhythm strings with faster rhythms, we can increase the rhythm's `pulse` setting. The pulse is
the duration of each character in a rhythm string, and defaults to 1. We can double the speed of the previous example 
by setting the pulse to 0.5. To do that, we also have to set the rhythm string as the rhythm.pattern like we did for
durations and intensities.

{@example 03-rhythm-string-pulse}


<a name="euclidean-rhythms"></a>
## Euclidean Rhythms 

Euclidean rhythms evenly distribute a given number of pulses along a time grid. 
 
chorus.js's Rhythm class has a function to generate Euclidean rhythms: `Rhythm.distribute(pulses, total)`
 
This `distribute()` function returns a rhythm string, so we can use it anywhere we can use a rhythm string (as the `rhythm` or `rhythm.pattern`): 

{@example 03-euclidean-rhythm}

To understand what's happening, let's see what rhythm strings `distribute()` generates:
```
const { Rhythm } = require('chorus');

Rhythm.distribute(6, 8);  // => 'x.xxx.xx'
Rhythm.distribute(3, 8);  // => 'x..x..x.'
Rhythm.distribute(3, 16); // => 'x.....x....x....'
Rhythm.distribute(7, 16); // => 'x..x.x.x..x.x.x.'
```

The first parameter controls the number of x's, and the second parameter controls the number of characters in the
rhythm string.

By default, `distribute()` rhythm strings start with an 'x' in the first position. If you want to change this, you
can use the `shift` option:

``` 
Rhythm.distribute(3, 8);               // => 'x..x..x.'
Rhythm.distribute(3, 8, { shift: 1 })  // => '..x..x.x'
Rhythm.distribute(3, 8, { shift: 2 })  // => '.x..x.x.'
Rhythm.distribute(3, 8, { shift: -1 }) // => '.x..x..x'
```
Each positive shift value takes the first character of the rhythm string and moves it to the end of the string.
Negative shift values work in reverse.

If you want to shift the pattern repeatedly so that an 'x' is still in the first position, you can use the `rotation` option:
```
Rhythm.distribute(3, 8);                   // => 'x..x..x.'
Rhythm.distribute(3, 8, { rotation: 1 });  // => 'x..x.x..'
Rhythm.distribute(3, 8, { rotation: -1 }); // => 'x.x..x..'
```
This is good for creating variations while keeping the note on the first beat.

You can also combine the `rotation` and `shift` options. The rotation will be applied first.


<a name="using-drums"></a>
## Using Drums

Since we are talking about rhythm, let's try using drum sounds. 

Setup a drum instrument of your choice in your music software.
DAWs have various "drum kit" (AKA "drum rack") instruments built-in, and there are lots of plug-ins/apps for drums.

Different pitches will play different drum sounds. 
Chorus.js defines some pitch constants for common drum sounds:
- `KICK` - kick drum (AKA bass drum)
- `SNARE` - snare drum normal hit
- `RIM` - snare drum rim shot
- `CLAP` - hand clap
- `CLOSED_HIHAT` - closed high hat cymbal
- `OPEN_HIHAT` - open high hat cymbal
- `CYMBAL` - crash cymbal

Let's try it:
{@example 03-drums}

If you don't want to pollute the global namespace, the drum constants are available under 
`require('chorus/names').DRUMS.KICK`, etc (NOTE: that's under the module 'chorus/names' not 'chorus').

Drum software usually allows sounds be freely re-assigned, so these drum constants may not work as expected. 
If not, check your drum software and experiment with Chorus.js's pitch constants, like this:
```
    parts: [{     
      pitches: [C2, Db2, D2, Eb2, E2, F2, C3, Db3, C4],
    }]
```
Note that some pitches may not play any sound. Once you figure out which pitches to use, consider defining your own constants.


<a name="next-steps"></a>
## Next Steps

Next is the {@tutorial 04-harmony} tutorial.