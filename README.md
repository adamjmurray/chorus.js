# chorus
## A music composition toolkit for JavaScript

### Features

- Generate multi-track songs with intuitive support for harmony-based compusition ("Western music").
- Realtime and file-based MIDI I/O


### Status

Early alpha version, not ready for general usage. 

If you found this and you're trying it anyway, see the examples folder.

For now, I recommend installing [the latest source code](https://github.com/adamjmurray/npm-chorus):

      npm install adamjmurray/npm-chorus

Check the github page for the latest info.


### Installation

Realtime MIDI I/O requires native code from the [midi package](https://www.npmjs.com/package/midi).
See [node-gyp](https://www.npmjs.com/package/node-gyp) for more info on how to install native Node.js code on your platform.

NOTE: Realtime MIDI I/O is optional. If you have problems installing the optional [midi package](https://www.npmjs.com/package/midi)
you can still work with MIDI file I/O, which is implemented in pure JavaScript. 
See the song-to-file.js example for how to generate MIDI files.


### How to hear something

Regardless of the approach you use, remember to set your volume to a moderate level.

#### Realtime MIDI I/O
 
You need two things:

1. A MIDI instrument, such as:
   * A stand-alone instrument application, like [SimpleSynth](http://notahat.com/simplesynth/) or [Helm](http://tytel.org/helm/)   
   * Or a software instrument inside a DAW application, like [GarageBand](https://www.apple.com/mac/garageband/) or [Ableton Live](https://www.ableton.com/en/live/)
   * Or a hardware synthesizer + a hardware MIDI interface   
2. A MIDI port to route MIDI messages from Chorus to the MIDI instrument.

The exact setup depends on your platform and the MIDI instrument. 
The possibilities are endless. I suggest some options below.

Once you're setup, the realtime MIDI I/O examples use an interactive prompt to select a MIDI port. As a shortcut, you can do:
   
        node node_modules/chorus/examples/play-song -p portname

**OS X**

Quick start:

1. Download [SimpleSynth](http://notahat.com/simplesynth/) and launch it
2. Select `MIDI Source: SimpleSynth virtual input` 
3. Run the Chorus examples and select `simplesynth` as the port.

Using DAWs or stand-along instrument applications:

1. Create an IAC (Inter-Application Communication) MIDI port (one-time setup):
   * Open OS X's `Audio MIDI Setup` application
   * Go to the "MIDI Studio" window (see `Window -> Show MIDI Studio` in the menu)
   * Double click `IAC Driver` (the Inter-Application Communication Driver for MIDI) to open the `IAC Driver Properties` window 
   * Make sure "Device is online is checked" 
   * If needed, click `More information` to expand the `IAC Driver Properties` window   
   * Click `+` to add a port and name it whatever you want.
2. Launch GarageBand and start a new project
3. Add a software instrument track
4. Run the Chorus examples and select the IAC Driver port you setup.

With other applications, you may need to configure it to use the IAC Driver port as input. 


**Windows**
 
Quick start: I think Windows has a built-in "General MIDI" port + instrument. TODO: Double check this and document here. 

Free software instrument suggestions:
* [Presonus Studio One Prime](https://shop.presonus.com/products/studio-one-prods/Studio-One-3-Prime) 
* [Cakewalk SONAR](https://www.cakewalk.com/Products/SONAR) (unlimited trial, saving and exporting disabled)
* [Bitwig Studio](http://bitwig.com) (unlimited trial, saving and exporting disabled)

MIDI port suggestions to route MIDI to a DAW or standalone instrument app:
* [LoopBe1](http://www.nerds.de/en/loopbe1.html)     
* [JACK Audio Connection Kit](http://jackaudio.org/)
  
TODO: document setup with Studio One Prime or one of the other free options  


**Linux**

Software instrument suggestions:
* [Bitwig Studio](http://bitwig.com)
* [Ardour](http://ardour.org) with [plugins](http://ardour.org/features.html#plugins)

MIDI port suggestions:
* Create an ALSA MIDI virtual port with the [amidi command](http://linuxcommand.org/man_pages/amidi1.html):

      amidi -p virtual -d
      
* [JACK Audio Connection Kit](http://jackaudio.org/)   


#### MIDI File I/O

You'll need a MIDI instrument, just like for realtime MIDI I/O. You also need a way to play back the MIDI file and route it to the instrument. 

The easiest way to do this is with a DAW application. For example:

1. Open GarageBand or the DAW of your choice
2. Create a software instrument track
3. Drag a MIDI file that Chorus generated onto the track (see the `song-to-file.js` example).
4. Press play


#### Troubleshooting

One small mistake can prevent MIDI I/O from working. If you can't hear anything, double check every aspect of your setup carefully.

Try testing your setup another way: If you have a MIDI input device, like a MIDI piano keyboard, test that you can play your software instrument with it.
