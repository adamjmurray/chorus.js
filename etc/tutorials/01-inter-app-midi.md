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

