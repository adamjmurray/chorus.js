## Chorus.js: Music Composition in JavaScript

[![npm version](https://badge.fury.io/js/chorus.svg)](https://npmjs.org/package/chorus)&nbsp;&nbsp;&nbsp;
[![build status](https://travis-ci.org/adamjmurray/chorus.js.svg?branch=master)](https://travis-ci.org/adamjmurray/chorus.js)&nbsp;&nbsp;&nbsp;
[![test coverage](https://coveralls.io/repos/github/adamjmurray/chorus.js/badge.svg?branch=master)](https://coveralls.io/github/adamjmurray/chorus.js?branch=master)


## Features

- Compose music with code via multi-track [MIDI](http://www.instructables.com/id/What-is-MIDI/)
  - output **real-time MIDI** to control synthesizers, samplers, and other MIDI instruments
  - output **MIDI files** to save your musical ideas with perfect timing
- Explore harmony using scales and chord progressions
- Explore [microtonal](https://en.wikipedia.org/wiki/Microtonal_music) tunings


<a name="requirements"></a>

## Requirements

- [Node.js](https://nodejs.org) v6+ (browser support is planned)
- Optional: compilation tools for native dependencies
  - If you want **real-time MIDI output**, follow [node-gyp's installation instructions](https://github.com/nodejs/node-gyp#installation) to setup compilation tools
  - Otherwise, ignore non-fatal errors during install. You can still use **MIDI file output**

<a name="quick-start-guide"></a>

## Quick Start Guide

1. Install

        npm install chorus

2. Create the file `quick-start.js`

  ```javascript
  // quick-start.js 
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

3. Output a MIDI file

  * Run:
        
          node quick-start.js -f quick-start.mid
            
  * Open `quick-start.mid` in any app that supports MIDI files
     
4. Output real-time MIDI ([requires native dependencies](#requirements))

  * On **macOS**
  
    * Download [SimpleSynth](http://notahat.com/simplesynth/) and launch it
      
    * Select `MIDI Source: SimpleSynth virtual input` in SimpleSynth
           
    * Run:

            node quick-start.js -p simplesynth

   * On **Windows**

     Use the built-in wavetable synth:
 
          node quick-start.js -p wavetable  

  
<a name="tutorials"></a>

### Tutorials

Work in progress!

1. [Intro / Setup](https://adamjmurray.github.io/chorus.js/tutorial-01-intro.html) - The basics of chorus.js and how to setup with a DAW
2. [Pitch](https://adamjmurray.github.io/chorus.js/tutorial-02-pitch.html) - how to organize pitch
3. [Rhythm](https://adamjmurray.github.io/chorus.js/tutorial-03-rhythm.html) - how to organize time
4. [Pitch & Harmony](https://adamjmurray.github.io/chorus.js/tutorial-04-harmony.html) - chords
5. [Song Structure](https://adamjmurray.github.io/chorus.js/tutorial-05-song-structure.html) - how to organize song structure
6. [Advanced Features](https://adamjmurray.github.io/chorus.js/tutorial-06-advanced-features.html) - how to avoid repetition and create variety
7. [Microtonality](https://adamjmurray.github.io/chorus.js/tutorial-07-microtonality.html) - how to use more than 12 pitches per octave


## Project Info

- [Full documentation](https://adamjmurray.github.io/chorus.js/)
- [Github page](https://github.com/adamjmurray/chorus.js/)
