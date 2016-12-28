#### How to: Organize Time

If you haven't already, [install chorus.js and follow the Quick Start Guide](./index.html#requirements)

**Outline**
- [Changing the Tempo](#tempo)
- [Using Drums](#using-drums)
- [Time Lists](#time-lists)
- [Rests](#rests)
- [Euclidean Rhythms](#euclidean-rhythms)
- [Rhythm Strings](#rhythm-strings)
- [Intensities & Durations](#instensities-and-durations)
- [Next Steps](#next-steps)


<a name="tempo"></a>
## Changing the Tempo

When we don't specify a rhythm, each note is a single beat. How fast is a beat?

The song's tempo determines how fast or slow a song plays. It is specified in terms of **beats per minute**, or `bpm` for short.
The default bpm is 120, which is 2 beats every second. Taking the example from the [Quick Start Guide](./index.html#quick-start), let's make it play
faster by increasing the bpm:
```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 240,
  sections: [{
    parts: [{
      pitches: [C4, D4, E4, F4, G4, F4, E4, D4, C4],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

Currently a single tempo/bpm is used for the entire song 
(support for tempo changes within a Song may be added in a future version).

Try changing the bpm in this example and see how it affects playback.


<a name="using-drums"></a>
## Using Drums

Since we are talking about rhythm, let's use drum sounds . 

The setup depends on your OS and DAW/music software. Here's 3 options:

#### Option 1: macOS Quick Start - Drums with SimpleSynth 
If you are using SimpleSynth on macOS (see the ["Real-time MIDI Output"](./index.html#real-time) section 
of the Quick Start Guide), do this to use drums:
1. Select MIDI channel 1 in the main window
2. Go the the `Instruments` pane (if you can't see it, use `Window -> Show Instruments` in the menu)
3. Scroll down and select `TR-808`. This is a "drum kit" with several different drum sounds


#### Option 2: Windows Quick Start - Built-in Drums 

TODO: Use channel 10 of GS synth?


#### Option 3: Drums in a DAW or Standalone App

DAWs have various "drum kit" (AKA "drum rack") instruments built-in, and there are lots of plug-ins/apps for drums.

Setup the drum instrument of your choice to receive MIDI on channel 1. We'll be using that channel throughout this tutorial.


### Playing Drum Sounds

Depending on your setup, each pitch typically pays a different drum sounds. 
Chorus.js defines some pitch constants for common drum sounds:
- `KICK` - kick drum (AKA bass drum)
- `SNARE` - snare drum normal hit
- `RIM` - snare drum rim shot
- `CLAP` - hand clap
- `CLOSED_HIHAT` - closed high hat cymbal
- `OPEN_HIHAT` - open high hat cymbal
- `CYMBAL` - crash cymbal

Let's try it:

```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [KICK, SNARE, RIM, CLAP, CLOSED_HIHAT, OPEN_HIHAT, CYMBAL],
    }]
  }]
});

Output.select().then(output => output.play(song));
```
Drum software usually allows sounds be freely re-assigned, so these drum constants may not work as expected. 
If not, check your drum software and experiment with Chorus.js's pitch constants, like this:
```
    ...
    parts: [{     
      pitches: [C2, Db2, D2, Eb2, E2, F2, C3, Db3, C4],
    }]
    ...
```
Note that some pitches may not play any sound. Once you figure out which pitches to use, consider defining your own constants.

The rest of this tutorial will use Chorus.js's built-in drum constants. Adjust as needed for your setup.


<a name="time-lists"></a>
## Time Lists

As we've seen, a Song `Part` plays notes by specifying `pitches` to play.

Every `Part` has a `rhythm` to control the timing of the notes. The default `rhythm` plays a note on every beat.

One way of specifying `rhythm` is with a "time list", which is the list of durations for each note. As soon
as one note is done, the next note will immediately play. For example:
```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [KICK, SNARE, CLAP, KICK, KICK, CLAP, SNARE, KICK, RIM, CYMBAL],
      rhythm:  [1,    0.5,   0.5,  2,    1,    0.5,  0.5,   1.5,  0.5, 4],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

This plays a kick drum for 1 beat, then a snare for half a beat, then a clap for half a beat, then a kick for 2 beats, and so on.


<a name="rests"></a>
## Rests

As mentioned in the previous section, when using time lists, the next note plays as soon as the previous note ends.
Sometimes, especially with sustained non-drum sounds like strings, we don't want the notes to bump up against each other like that.

Rests allow us to create space between the notes. A rest is specified by a negative numbers in a time list.
The duration of the rest is its absolute value, so `-2` is a rest for 2 beats.

This example plays a note on every beat, but the duration changes each time. Rests are used to keep the
notes paying on each beat.

NOTE: To hear this example properly, you probably need to switch back to non-drum sounds.
```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [C4, C4,        C4,          C4,          C4],
      rhythm:  [1,  0.5, -0.5, 0.25, -0.75, 0.05, -0.95, 4],
    }]
  }]
});

Output.select().then(output => output.play(song));
```
The spacing in the pitches list is there just to show how the notes line up with the rhythm.


<a name="euclidean-rhythms"></a>
## Euclidean Rhythms 

TODO


<a name="rhythm-strings"></a>
## Rhythm Strings

TODO

When a String, it can contain the following characters:

"X" → accented note
"x" → normal note
"=" → tie
"." → rest
Each characters' duration is determined by the pulse option. NOTE: Other characters are ignored and can be used to improve readability, for example "X.x.|x==.|..x=|x=X="

pulse - The duration in beats of each character in a String pattern. Only relevant if the pattern option is a String.



<a name="instensities-and-durations"></a>
## Intensities & Durations

TODO


<a name="next-steps"></a>
## Next Steps

Next is the {@tutorial 03-pitch-and-harmony} tutorial.