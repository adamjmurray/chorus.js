- [Pitch Overview](#pitch-overview)
- [Absolute Pitch](#absolute-pitch)
- [Simultaneous Pitches](#simultaneous-pitches)
- [Scale-Relative Pitch](#scale-relative-pitch)
- [Built-in Scales](#builtin-scales)
- [Custom Scales](#custom-scales)
- [Next Steps](#next-steps)


<a name="pitch-overview"></a>
## Pitch Overview

Pitch is the perception of frequency in sound, in other words, how "high" or "low" does a note sound? 

Pitches in chorus.js can be absolute or relative.

Absolute pitches indicate exactly which piano key to play on a piano.

Relative pitches reference the pitches in scales and chords using integers. We'll call these scale-relative and chord-relative pitches. 
Relative pitches makes it easier to work with scales and chords. For example, you can easily avoid playing a "wrong" note.

This tutorial explores absolute pitches and scale-relative pitches. Chord-relative pitches will be covered in the {@tutorial 04-harmony} tutorial.


<a name="absolute-pitch"></a>
## Absolute Pitches

In chorus.js, constants are provided for every possible pitch value that MIDI supports. 
These constants are named using [Scientific Pitch Notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation), 
which means the lowest note is C-1 and the highest note/constant is G7.
We have constants for flatted notes, like `Eb4`, but not the equivalent pitch name `D#4`, because # is not allowed in JavaScript names.
Similarly, `C-1` is not a valid name, so we use `C_1` to indicate the lowest C.

These constants can be imported into the global namespace for convenience like this:
```
require('chorus/names').into(global);
```

And then used in a Part's pitches list:

```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [C4, D4, E4, F4, G4, F4, D4, B3, C4],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

If you don't want to pollute the global namespace, you can import the specific constants you want to use out of
chorus's PITCHES data structure. This example shows every PITCHES constant from lowest to highest:
```
const { Song, Output, PITCHES } = require('chorus');
const {
  C_1, Db_1, D_1, Eb_1, E_1, F_1, Gb_1, G_1, Ab_1, A_1, Bb_1, B_1,
  C0, Db0, D0, Eb0, E0, F0, Gb0, G0, Ab0, A0, Bb0, B0,
  C1, Db1, D1, Eb1, E1, F1, Gb1, G1, Ab1, A1, Bb1, B1,
  C2, Db2, D2, Eb2, E2, F2, Gb2, G2, Ab2, A2, Bb2, B2,
  C3, Db3, D3, Eb3, E3, F3, Gb3, G3, Ab3, A3, Bb3, B3,
  C4, Db4, D4, Eb4, E4, F4, Gb4, G4, Ab4, A4, Bb4, B4,
  C5, Db5, D5, Eb5, E5, F5, Gb5, G5, Ab5, A5, Bb5, B5,
  C6, Db6, D6, Eb6, E6, F6, Gb6, G6, Ab6, A6, Bb6, B6,
  C7, Db7, D7, Eb7, E7, F7, Gb7, G7, Ab7, A7, Bb7, B7,
  C8, Db8, D8, Eb8, E8, F8, Gb8, G8, Ab8, A8, Bb8, B8,
  C9, Db9, D9, Eb9, E9, F9, Gb9, G9
} = PITCHES;

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [C4, D4, E4, F4, G4, F4, D4, B3, C4],
    }]
  }]
});

Output.select().then(output => output.play(song));
```


<a name="simultaneous-pitches"></a>
## Simultaneous Pitches

To play more than one note at a time, use a list of pitches inside the pitches list:
```
const { Song, Output, PITCHES } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [
        C4, 
        [D4, F4], 
        [E4, G4], 
        [F4, A4], 
        [G4, B4], 
        [F4, A4], 
        [D4, F4], 
        [B3, D4], 
        [C4, G3, C3]
      ],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

In this example, each row of pitches plays simultaneously.


<a name="scale-relative-pitch"></a>
## Scale-Relative Pitch

To use a scale, set the scale at the Section level, and set the Part mode to `'scale'`.
We can play a C-major scale like this: 
```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [0, 1, 2, 3, 4, 5, 6, 7],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

When a Part is in `'scale'` mode, a `pitches` values of 0 is the first note in the scale, 
1 is the second note in the scale, and so on.
The octave is determined by the part's octave, which defaults to 4. 
So in this case, a pitches value of 0 produces the absolute pitch `C4`. 

If you wanted to play that C-major scale an octave lower, you could do it like this:
```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      octave: 3,
      pitches: [0, 1, 2, 3, 4, 5, 6, 7],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

Now the relative pitch 0 is `C3` instead of `C4`.

When the pitches value runs out of scale notes and "wraps around", we go up an octave. 
The MAJOR scale has 7 pitches, so the pitch value `7` (the 8th note of the scale) is a `C5`, one octave higher than when we started.

You can use scales with any number of pitches in chorus.js.

Negative numbers descend the scale, and go down an octave when it "wraps around". So this is a descending C-major scale:
```
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [0, -1, -2, -3, -4, -5, -6, -7],
    }]
  }]
});

Output.select().then(output => output.play(song));
```

<a name="builtin-scales"></a>
## Built-in Scales

chorus.js ships with a lot of built-in scales:
```
console.log(require('chorus').SCALES);
```
Note each of these scale constants is a function. Each scale is defined as relative intervals that can start on any pitch class 
(a pitch class is just a pitch without an octave, because scales are not tied to any specific octave). 
So we can call `MAJOR(D)` to make a D-major scale, `MAJOR(Eb)` to make an Eb-major scale, and so on.

More info on some of the built-in scales can be found [here](https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes)

If you don't want to pollute the global namespace, here's how to use built-in scales:

```
const { Song, Output, SCALES, PITCH_CLASSES } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: SCALES.MAJOR(PITCH_CLASSES.C),
    parts: [{
      mode: 'scale',
      pitches: [0, 1, 2, 3, 4, 5, 6, 7],
    }]
  }]
});

Output.select().then(output => output.play(song));
```


<a name="custom-scales"></a>
## Custom Scales

A scale is defined by a list of intervals and a starting pitch class. Instead of using the built in scales, we can define our own:

```
const { Song, Output, Scale, PITCH_CLASSES } = require('chorus');

const song = new Song({
  sections: [{
    scale: new Scale([2,2,1,2,2,2,1], PITCH_CLASSES.C),
    parts: [{
      mode: 'scale',
      pitches: [0, 1, 2, 3, 4, 5, 6, 7],
    }]
  }]
});

Output.select().then(output => output.play(song));
```


<a name="next-steps"></a>
## Next Steps

Now that you know how to control pitch, let's turn our attention to timing in the {@tutorial 03-rhythm} tutorial.