## Chorus.js: Music Composition in JavaScript

[![npm version](https://badge.fury.io/js/chorus.svg)](https://npmjs.org/package/chorus)&nbsp;&nbsp;&nbsp;
[![build status](https://travis-ci.org/adamjmurray/chorus.js.svg?branch=master)](https://travis-ci.org/adamjmurray/chorus.js)&nbsp;&nbsp;&nbsp;
[![test coverage](https://coveralls.io/repos/github/adamjmurray/chorus.js/badge.svg?branch=master)](https://coveralls.io/github/adamjmurray/chorus.js?branch=master)


## Features

- Compose music with Node.js
- Harmony-based sequencing using scales and chord progressions
- Multitrack [MIDI](http://www.instructables.com/id/What-is-MIDI/) output
  - **real-time MIDI** &rarr; control MIDI instruments like synthesizers
  - **MIDI files** &rarr; capture musical ideas for later use
- [Microtonal](https://en.wikipedia.org/wiki/Microtonal_music) support

Browser support is planned for 2017.


## Requirements

- [Node.js](https://nodejs.org) v6 or higher
- Optional: compilation tools for native dependencies
  - If you want **real-time MIDI output**, do [node-gyp's installation instructions](https://github.com/nodejs/node-gyp#installation) 
  - Otherwise, ignore non-fatal errors during installation. You can still use **MIDI file output**

## Installation

      npm install chorus


## Quick Start Guide

chorus.js (currently) does not make any sound on it's own. It produces [MIDI](http://www.instructables.com/id/What-is-MIDI/)
output, which is a standard format for controlling music-making software. Let's see how this works by playing a scale.

Create the file `simple-scale.js` in the folder where you installed chorus:

```
# simple-scale.js
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

Don't worry if most of this doesn't make sense yet. We'll explore everything in detail in the tutorials (see links below).

*NOTE: `require('chorus/names').into(global)` adds global constants, 
so we can type things like `MAJOR(C)` instead of `SCALES.MAJOR(PITCH_CLASSES.C)`. 
This is convenient but potentially dangerous, and not recommended within large projects. 
The {@tutorial 07-under-the-hood} tutorial will explain how to avoid this. For now, let's continue...*
  
TODO: Need absolute url to tutorial ^  

`Output.select()` allows us to choose real-time or file output. 
To see usage instructions, run it:

        node c-major-scale.js
        
Let's take a closer look at our output options.       


### MIDI File Output

1. Run
        node c-major-scale.js -f c-major-scale.mid
        
2. Open (or drag and drop) `c-major-scale.mid` to supports MIDI playback, such as a DAW        

For example, with macOS's default settings, you can double click a .mid file to open in in Garage Band and play it.


### Real-time MIDI Output

**OS X**

1. Download [SimpleSynth](http://notahat.com/simplesynth/) and launch it
2. Select `MIDI Source: SimpleSynth virtual input` 
3. Run the Chorus examples and select `simplesynth` as the port.

        node node_modules/chorus/examples/play-song -p simplesynth


**Windows**

1. Run the Chorus.js examples and select `Microsoft GS Wavetable Synth` as the port.
 
        node node_modules/chorus/examples/play-song -p wavetable


## Playing a Song in realtime

Selecting output

```
const { selectOutput } = require('chorus');

```

TODO: finish example



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

