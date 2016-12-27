#### How to: Organize Pitch

If you haven't already, [install chorus.js and do the Quick Start Guide](./index.html#requirements)

**Outline**
- [Pitch Overview](#pitch-overview)
- [Scales](#scales)
- [Harmony & Chord Progressions](#harmony)
- [Arpeggios](#arpeggio-mode)
- [Melodies](#lead-mode)
- [Basslines & Chord Inversions](#bass-mode)
- [Simultaneous Pitches](#simultaneous)
- [Non-Scale Pitches](#non-scale)
- [Next Steps](#next-steps)


<a name="pitch-overview"></a>
## Pitch Overview

TODO: quick song structure overview, link to song-structure tutorial, chorus.js philosophy on pitch organization


<a name="scales"></a>
## Scales

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

When a Part is in `'scale'` mode, a `pitches` values of 0 is the first note in the scale, 1 is the second note in the scale, and so on.
The most common scales have 7 distinct pitches, and the 8th pitch (pitches value `7`) is the same as the first pitch but
an octave higher. You can use scales with more or less than 7 distinct pitches.

TODO negative numbers

TODO Built-in scales

TODO quick note about custom scales, link to under-the-hood


<a name="harmony"></a>
## Harmony & Chord Progressions

TODO


<a name="arpeggio-mode"></a>
## Arpeggios

TODO


<a name="lead-mode"></a>
## Melodies

TODO


<a name="bass-mode"></a>
## Basslines & Chord Inversions

TODO


<a name="simultaneous"></a>
## Simultaneous Pitches

TODO


<a name="non-scale"></a>
## Non-Scale Pitches

TODO


<a name="next-steps"></a>
## Next Steps

Next is the {@tutorial 04-song-structure} tutorial.