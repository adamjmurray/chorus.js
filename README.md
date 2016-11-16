[![npm version](https://badge.fury.io/js/chorus.svg)](https://npmjs.org/package/chorus)&nbsp;&nbsp;&nbsp;
[![build status](https://travis-ci.org/adamjmurray/chorus.js.svg?branch=master)](https://travis-ci.org/adamjmurray/chorus.js)&nbsp;&nbsp;&nbsp;
[![test coverage](https://coveralls.io/repos/github/adamjmurray/chorus.js/badge.svg?branch=master)](https://coveralls.io/github/adamjmurray/chorus.js?branch=master)

# chorus.js

A music composition toolkit for JavaScript

## Features

- Multi-track music creation via [MIDI](http://www.instructables.com/id/What-is-MIDI/) real-time and file output
- Harmony-based pitch sequencing using scales and chord progressions
- Minimalistic API suitable for learning music theory 
- Microtonal support for experimental music with more than 12 pitches per octave


## Status

Beta version. The API is still in flux, but should be stable soon.

Currently requires Node.js 6+. It will be updated to support web browsers at some point.


## Documentation

Work in progress: https://adamjmurray.github.io/chorus.js/

See this README, the examples folder, documentation, and tests for ideas on usage.


## Installation

      npm install chorus

Realtime MIDI I/O (via the [midi package](https://www.npmjs.com/package/midi)) requires native code to be compiled during installation.
See [node-gyp](https://www.npmjs.com/package/node-gyp) for details. Here's how I did it:

**OS X**

1. Install Xcode from the App Store 
2. Install Xcode Command Line Tools (in the app's menu: Xcode &rarr; Preferences &rarr; Downloads)

**Windows**

1. Install Python 2.7.x
2. Install Visual Studio 2015 Community Edition 
   * Customize the install to include the "Visual C++" programming language 
3. Launch the "Developer Command Prompt for VS2015"
4. Run npm install -g npm@latest (to avoid [this issue](https://github.com/nodejs/node-gyp/issues/972))  

NOTE: Realtime MIDI I/O is optional. If you have problems installing the optional [midi package](https://www.npmjs.com/package/midi)
you can still work with MIDI file I/O, which is implemented in pure JavaScript. 



## Usage

Chorus.js uses MIDI to communicate with compatible apps that can produce sound. 
It can send MIDI messages in realtime to another app, or write to a MIDI file. 

Remember to set your volume to a moderate level.


### Realtime MIDI I/O Quick Start

**OS X**

1. Download [SimpleSynth](http://notahat.com/simplesynth/) and launch it
2. Select `MIDI Source: SimpleSynth virtual input` 
3. Run the Chorus examples and select `simplesynth` as the port.

        node node_modules/chorus/examples/play-song -p simplesynth


**Windows**

1. Run the Chorus.js examples and select `Microsoft GS Wavetable Synth` as the port.
 
        node node_modules/chorus/examples/play-song -p wavetable
        

### Realtime MIDI I/O Advanced Setup with a DAW

We'll walk through the setup with [Bitwig Studio](http://bitwig.com) because it's cross-platform and has a free trial. Setup for other DAWs should be similar.  
 
**OS X**

1. Create an IAC (Inter-Application Communication) MIDI port:
   * Open OS X's `Audio MIDI Setup` application
   * Go to the `MIDI Studio` window (menu: `Window -> Show MIDI Studio`)
   * Double click `IAC Driver` to open the `IAC Driver Properties` window 
   * Make sure `Device is online` is checked 
   * Click `More information` to expand the `IAC Driver Properties` window   
   * Click `+` to add a port and name it whatever you want.
2. Launch Bitwig Studio and start a new project
3. Add a generic MIDI Controller:
   * Bitwig preferences &rarr; Controllers &rarr; Add Controller Manually &rarr; Generic &rarr; MIDI Keyboard
   * Choose the IAC port
4. Add a software instrument track with an instrument (such as Polysynth)
5. Run the Chorus examples and select the IAC Driver port you setup. For example, if you named it "iac":

        node node_modules/chorus/examples/play-song -p iac


**Windows**

1. Create a virtual MIDI port:
   * Install [loopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html)
   * Run loopMIDI and click `+` to add a virtual MIDI port
2. Launch Bitwig Studio and start a new project
3. Add a generic MIDI Controller:
   * Bitwig preferences &rarr; Controllers &rarr; Add Controller Manually &rarr; Generic &rarr; MIDI Keyboard
   * Choose the loopMIDI port
4. Add a software instrument track with an instrument (such as Polysynth)
5. Run the Chorus examples and select the loopMIDI port you setup:

        node node_modules/chorus/examples/play-song -p loopmidi


**Linux**

Similar to above. To setup a virtual / inter-app MIDI port, try the [JACK Audio Connection Kit](http://jackaudio.org/).   


### MIDI File I/O

Again, we'll demonstrate the setup with [Bitwig Studio](http://bitwig.com). Other DAWs should be similar.

1. Generate a MIDI file with Chorus:

        node node_modules/chorus/examples/song-to-file.js 

2. Launch Bitwig Studio and start a new project
3. Add a software instrument track with an instrument (such as Polysynth)
4. Drag a MIDI file that Chorus generated onto the track
5. Press Bitwig's play button



### Troubleshooting

One small mistake can prevent MIDI I/O from working. If you can't hear anything, double check every aspect of your setup carefully.

If you have a MIDI input device, like a MIDI piano keyboard, test that you can play your software instrument with it.
