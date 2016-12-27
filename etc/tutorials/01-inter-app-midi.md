#### How to: Connect to DAWs or Standalone Synthesizer Apps

If you haven't already, [install chorus.js and do the Quick Start Guide](./index.html#requirements)

This tutorial is optional and intended for DAW/synthesizer app users.<br> 
If you are ok with the setup from the Quick Start Guide, skip ahead to the {@tutorial 02-rhythm} tutorial.

**Outline:**
- [Creating Inter-app MIDI Ports](#inter-app-midi) 
  - [macOS](#macos)
  - [Windows](#windows)
  - [Linux](#linux)
- [DAW Setup](#daw-setup)
  - [Ableton Live](#ableton-live)
  - [Bitwig Studio](#bitwig-studio)
  - [Garage Band](#garage-band)
  - [Logic](#logic)
  - [Studio One](#studio-one)
  - TODO: [Maybe one standalone synth?](#???)
- [Next Steps](#next-steps)  
  
TODO: Add screenshots for everything

<a name="inter-app-midi"></a>
## Creating Inter-App MIDI Ports 

First we need to create a "virtual MIDI port" that can be used to send MIDI messages between applications.

<a name="macos"></a>
### macOS

1. Open the built-in `Audio MIDI Setup` application (under `/Applications/Utilities`)
2. Go to the `MIDI Studio` window (menu: `Window -> Show MIDI Studio`)
3. Double click `IAC Driver` to open the `IAC Driver Properties` window 
4. Make sure `Device is online` is checked 
5. Click `More information` to expand the `IAC Driver Properties` window   
6. Click `+` to add a port and name it whatever you want.

TODO: screenshot


<a name="windows"></a>
### Windows

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


<a name="linux"></a>
### Linux

Try the [JACK Audio Connection Kit](http://jackaudio.org/).   


<a name="daw-setup"></a>
## DAW Setup

Now we need to use the inter-app MIDI port we've created as input to our DAW (or standalone synthesizer app).
The way you do this depends on the DAW/app (so check its documentation). Examples for several DAWs are shown below. 

<a name="ableton-live"></a>
### Ableton Live

<a name="bitwig-studio"></a>
### Bitwig Studio

[Bitwig Studio](http://bitwig.com) is a cross-platform DAW (Linux too!) and has a free trial.  

TODO: Need to install Tom's MIDI scripts for multi-channel MIDI

2. Launch Bitwig Studio and start a new project
3. Add a generic MIDI Controller:
   * Bitwig preferences &rarr; Controllers &rarr; Add Controller Manually &rarr; Generic &rarr; MIDI Keyboard
   * Choose the IAC port
4. Add a software instrument track with an instrument (such as Polysynth)
5. Run the Chorus examples and select the IAC Driver port you setup. For example, if you named it "iac":

        node node_modules/chorus/examples/play-song -p iac


<a name="garage-band"></a>
### Garage Band

TODO


<a name="logic"></a>
### Logic

TODO


<a name="studio-one"></a>
### Studio One

TODO


<a name="next-steps"></a>
## Next Steps

Next is the {@tutorial 02-rhythm} tutorial.