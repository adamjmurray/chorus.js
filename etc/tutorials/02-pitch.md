- [Pitch Overview](#pitch-overview)
- [Absolute Pitches](#absolute-pitches)
- [Simultaneous Pitches](#simultaneous-pitches)
- [Scale-Relative Pitches](#scale-relative-pitches)
- [Octaves](#octaves)
- [Built-in Scales](#builtin-scales)
- [Custom Scales](#custom-scales)
- [Next Steps](#next-steps)


<a name="pitch-overview"></a>
## Pitch Overview

Pitch is the perception of frequency in sound. In other words, how "high" or "low" does a note sound? 

Pitches in chorus.js can be absolute or relative.

Absolute pitches indicate exactly which piano key to play on a piano.
Relative pitches reference the pitches in scales and chords using integers. We'll call these scale-relative and chord-relative pitches. 
Relative pitches makes it easier to work with scales and chords. For example, you can easily avoid playing a "wrong" note.

This tutorial explores absolute pitches and scale-relative pitches. Chord-relative pitches will be covered in the {@tutorial 04-harmony} tutorial.


<a name="absolute-pitches"></a>
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

{@example 02-absolute-pitches}

If you don't want to pollute the global namespace, you can import the specific constants you want to use out of
chorus's PITCHES data structure. This example shows every PITCHES constant from lowest to highest:
{@example 02-pitch-constants}


<a name="simultaneous-pitches"></a>
## Simultaneous Pitches

To play more than one note at a time, use a list of pitches inside the pitches list:
{@example 02-simultaneous-pitches}
In this example, each row of pitches plays simultaneously.


<a name="scale-relative-pitches"></a>
## Scale-Relative Pitches

To use a scale, set the scale at the Section level, and set the Part mode to `'scale'`.
We can play a C-major scale like this: 
{@example 02-scale-relative-pitches}

When a song part is in `'scale'` mode, a `pitches` value of 0 is the first note in the scale, 
1 is the second note in the scale, and so on.
The octave is determined by the part's octave, which defaults to 4. 
So in this case, a pitches value of 0 produces the absolute pitch `C4`. 

When the pitches value runs out of scale notes and "wraps around", we go up an octave. 
The major scale has 7 pitches, so the pitch value `7` (the 8th note of the scale) is `C5`, one octave higher than when we started.

*Note: You can use scales with any number of pitches in chorus.js. 7-note scales, like major and minor, are the most common in "Western" music.*

Negative numbers descend the scale, and go down an octave when it "wraps around". So this is a descending C-major scale:
{@example 02-scale-relative-descending}


<a name="octaves"></a>
## Octaves

As mentioned in the previous section, a song part has a default octave of 4, so if your scale starts on C,
pitch 0 will be a C4.

You can set a different octave on each song part.

If you wanted to play that C-major scale an octave lower than the default, you can do:
{@example 02-octave} 

Now the relative pitch 0 is `C3` instead of `C4`.


<a name="builtin-scales"></a>
## Built-in Scales

chorus.js ships with a lot of built-in scales:
```
console.log(require('chorus').SCALES);
```
Note that each of these `SCALES` constants is a function. Each scale is defined as relative intervals that can start on any pitch class 
(a pitch class is just a pitch without an octave), because scales are not tied to any specific octave. 

So we can call `MAJOR(D)` to make a D-major scale, `MAJOR(Eb)` to make an Eb-major scale, and so on.

<a href="./names_scales.js.html">These available SCALES type functions are defined here</a>.

More info on some of the built-in scales can be found [here](https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes)

If you don't want to pollute the global namespace, here's how to use built-in scales:
{@example 02-built-in-scales}


<a name="custom-scales"></a>
## Custom Scales

A scale is defined by a list of intervals and a starting pitch class. Instead of using the built-in scales, we can define our own:
{@example 02-custom-scales}

That's just a major a scale again, but now you can change `new Scale([2,2,1,2,2,2,1]` to experiment with your own scales. 

<a name="next-steps"></a>
## Next Steps

Now that you know how to control pitch, let's turn our attention to timing in the {@tutorial 03-rhythm} tutorial.