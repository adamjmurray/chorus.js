## Chorus.js: Music Composition in JavaScript

[![npm version](https://badge.fury.io/js/chorus.svg)](https://npmjs.org/package/chorus)&nbsp;&nbsp;&nbsp;
[![build status](https://travis-ci.org/adamjmurray/chorus.js.svg?branch=master)](https://travis-ci.org/adamjmurray/chorus.js)&nbsp;&nbsp;&nbsp;
[![test coverage](https://coveralls.io/repos/github/adamjmurray/chorus.js/badge.svg?branch=master)](https://coveralls.io/github/adamjmurray/chorus.js?branch=master)


## Features

- Compose music with Node.js
- Harmony-based sequencing using scales and chord progressions
- Multitrack [MIDI](http://www.instructables.com/id/What-is-MIDI/) output
  - **real-time MIDI** - control MIDI instruments like synthesizers
  - **MIDI files** - capture musical ideas for later use
- [Microtonal](https://en.wikipedia.org/wiki/Microtonal_music) support

Browser support is planned for 2017.


<a name="requirements"></a>
## Requirements

- [Node.js](https://nodejs.org) v6 or higher
- Optional: compilation tools for native dependencies
  - If you want **real-time MIDI output**, follow [node-gyp's installation instructions](https://github.com/nodejs/node-gyp#installation) 
  - Otherwise, ignore non-fatal errors during installation. You can still use **MIDI file output**

## Installation

      npm install chorus

Note: If you setup the native dependencies for real-time MIDI output *after* installation, 
you must reinstall chorus.


## Quick Start Guide

Chorus.js (currently) does not make any sound on it's own. It outputs [MIDI](http://www.instructables.com/id/What-is-MIDI/),
a standard format for controlling music software & hardware. Let's see how it works.

Create the file `simple-song.js` in the folder where you installed chorus:

```
# simple-song.js
const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    parts: [{
      pitches: [C4, D4, E4, F4, G4, F4, E4, D4, C4],
    }]
  }]
});

Output.select().then(output => output.play(song));

```

Don't worry if this doesn't make sense yet. We'll explore everything in the tutorials below.

NOTE: `require('chorus/names').into(global)` adds global constants, 
so we can write `C4` instead of `PITCHES.C4`. This is convenient but potentially dangerous, and not recommended in 
complex projects that combine chorus.js with other libraries. 
The {@tutorial 07-under-the-hood} tutorial will explain how to avoid this. For now, let's continue...
  
TODO: Need absolute url to tutorial ^  

`Output.select()` allows us to choose real-time or file output. 
To see usage instructions, run it:

        node simple-song.js
        
Let's take a closer look at our output options.       


### MIDI File Output

1. Run

        node simple-song.js -f simple-song.mid
        
2. Open (or drag and drop) `simple-song.mid` to an app that supports MIDI playback, such as a DAW        

<br>
For example (assuming you have not changed the default file associations on your OS):
* macOS: Double-click a .mid file (or run `open simple-song.mid` in the Terminal) to open in Garage Band and play it
* Windows: TODO


### Real-time MIDI Output

NOTE: Real-time output requires an optional native dependency to be installed, as explained in the [requirements](#requirements)
above. If you have trouble installing that, you can use MIDI file output instead. 

**macOS**

1. Download [SimpleSynth](http://notahat.com/simplesynth/) and launch it
2. Select `MIDI Source: SimpleSynth virtual input` 
3. Run the Chorus examples and select `simplesynth` as the port.

        node simple-song.js -p simplesynth


**Windows**

1. Run the Chorus.js examples and select `Microsoft GS Wavetable Synth` as the port.
 
        node simple-song.js -p wavetable

**Other ways of selecting real-time MIDI output ports**

TODO


<a name="tutorials"></a>
### Tutorials

TODO: need absolute URLs here

1. {@tutorial 01-inter-app-midi} - how to connect to DAWs or standalone synthesizer apps
2. {@tutorial 02-rhythm} - how to organize time
3. {@tutorial 03-pitch-and-harmony} - how to organize pitch
4. {@tutorial 04-song-structure} - how to organize higher-level song structures
5. {@tutorial 05-diversification} - how to avoid repetition
6. {@tutorial 06-microtonality} - how to have more than 12 pitches per octave
7. {@tutorial 07-under-the-hood} - how to hack on chorus.js


## Project Info

- [Full documentation](https://adamjmurray.github.io/chorus.js/)
- [Github page](https://github.com/adamjmurray/chorus.js/)
