## Chorus.js: Music Composition in JavaScript

[![npm version](https://badge.fury.io/js/chorus.svg)](https://npmjs.org/package/chorus)&nbsp;&nbsp;&nbsp;
[![build status](https://travis-ci.org/adamjmurray/chorus.js.svg?branch=master)](https://travis-ci.org/adamjmurray/chorus.js)&nbsp;&nbsp;&nbsp;
[![test coverage](https://coveralls.io/repos/github/adamjmurray/chorus.js/badge.svg?branch=master)](https://coveralls.io/github/adamjmurray/chorus.js?branch=master)


## Features

- Harmony-based sequencing using scales and chord progressions
- Multitrack [MIDI](http://www.instructables.com/id/What-is-MIDI/) output
  - **real-time MIDI** - control synthesizers, samplers, and other MIDI instruments
  - **MIDI files** - save musical ideas to use in your [DAW](https://en.wikipedia.org/wiki/Digital_audio_workstation) later
- [Microtonal](https://en.wikipedia.org/wiki/Microtonal_music) support


<a name="requirements"></a>

## Requirements

- [Node.js](https://nodejs.org) v6 or higher (browser support is planned for later)
- Optional: compilation tools for native dependencies
  - If you want **real-time MIDI output**, follow [node-gyp's installation instructions](https://github.com/nodejs/node-gyp#installation) to setup the compilation tools
  - Otherwise, ignore non-fatal errors during install. You can still use **MIDI file output**

<a name="quick-start"></a>
<a name="real-time"></a>

## Quick Start Guide

1. Install

        npm install chorus

2. Create a script `simple-song.js` (in the folder where you installed chorus)

  ```javascript
  // simple-song.js
  
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

3. Run the script
  * Option A: **Real-time MIDI output**   
    * On **macOS**
      * Download [SimpleSynth](http://notahat.com/simplesynth/) and launch it      
      * Select `MIDI Source: SimpleSynth virtual input` in SimpleSynth       
      * Run:

              node simple-song.js -p simplesynth

     * On **Windows**

       Use Window's built-in wavetable synth by running:
 
            node simple-song.js -p wavetable
  
  * Option B: MIDI file output
  
    Run:
    
          node simple-song.js -f simple-song.mid
        
    then open `simple-song.mid` in an app that supports MIDI files

  
<a name="tutorials"></a>

### Tutorials

Work in progress!

1. [Inter-App MIDI](https://adamjmurray.github.io/chorus.js/tutorial-01-inter-app-midi.html) - how to connect to DAWs or standalone synthesizer apps
2. [Rhythm](https://adamjmurray.github.io/chorus.js/tutorial-02-rhythm.html) - how to organize time
3. [Pitch & Harmony](https://adamjmurray.github.io/chorus.js/tutorial-03-pitch-and-harmony.html) - how to organize pitch
4. [Song Structure](https://adamjmurray.github.io/chorus.js/tutorial-04-song-structure.html) - how to organize song structure
5. [Advanced Features](https://adamjmurray.github.io/chorus.js/tutorial-05-advanced-features.html) - how to avoid repetition and create variety
6. [Microtonality](https://adamjmurray.github.io/chorus.js/tutorial-06-microtonality.html) - how to use more than 12 pitches per octave
7. [Under the Hood](https://adamjmurray.github.io/chorus.js/tutorial-07-under-the-hood.html) - how to hack on chorus.js


## Project Info

- [Full documentation](https://adamjmurray.github.io/chorus.js/)
- [Github page](https://github.com/adamjmurray/chorus.js/)
