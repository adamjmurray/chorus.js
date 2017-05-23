If you haven't already, [install chorus.js and follow the Quick Start Guide](./index.html#requirements)

**Tutorial Outline:**
- [Defining Songs](#defining-songs)
- [Selecting Outputs](#selecting-outputs)
- [Creating Virtual MIDI Ports](#virtual-midi-ports) 
  - [macOS](#macos)
  - [Windows](#windows)
  - [Linux](#linux)
- [DAW Setup](#daw-setup)
- [Next Steps](#next-steps)  

<a name="defining-songs"></a>  
## Defining Songs

chorus.js makes music by writing JavaScript code that defines a Song, selects an Output, and plays the Song with that Output. 
 
Let's see look at how this works using the Quick Start example:
```
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


After loading chorus, we can use its Song object to define our song. 

A Song is a list of Sections that are played sequentially. 
Each Section is a list of Parts that are played simultaneously.
This structure will be explored in detail in the {@tutorial 05-song-structure} tutorial.

For the next few tutorials, we'll focus on making single-section, single-part songs, by filling in the `// ...` in this
basic structure:
```
const song = new Song({
 sections: [{
   parts: [{
     // ...
   }]
 }]
});
```

The simplest Part is just a list of pitches:
```
{
  pitches: [C4, D4, E4, F4, G4, F4, E4, D4, C4],
}
```

In this case, each pitch plays for 1 beat. 
We'll learn a lot more about {@tutorial 02-pitch} and {@tutorial 03-rhythm} in the next few tutorials.

<a name="selecting-outputs"></a> 
## Selecting Outputs

Chorus.js (currently) does not make any sound on it's own. It outputs [MIDI](http://www.instructables.com/id/What-is-MIDI/),
a standard format for controlling music software & hardware. It can either output a MIDI file for later playback, or
output MIDI in real-time over a given MIDI port.

When `Output.select()` is called, several things can happen depending on how
you ran the script. Here are the ways we can run a chorus.js script:

* Output a MIDI file named file.mid:

       node quick-start.js -f file.mid
         
* Output real-time MIDI to the virtual MIDI port named "virtual1": 
       
       node quick-start.js -p virtual1
        
* Same as above (output realtime MIDI to virtual port "virtual1"), but specify the port with an environment variable:

       CHORUS_OUTPUT_PORT=virtual1 node quick-start.js 

  *NOTE: the -p command line argument overrides this environment variable*
  
* List all real-time MIDI ports and select one interactively (or type ctrl+C to exit):

       node quick-start.js

When specifying the real-time MIDI output port (either interactively, via the command line arg or via environment variable),
a case-insensitive substring match is used. So `-p virt` and `-p tual1` would both match "virtual1". If a single port matches, 
it is used to play the song. Otherwise, you'll be prompted to interactively select a port.

<a name="inter-app-midi"></a>
## Virtual MIDI Ports 

*NOTE: The rest of this tutorial is optional and intended for DAW / synthesizer app users. Feel free to skip ahead to the {@tutorial 02-pitch} tutorial.*

To connect chorus.js to another application, 
first we need to create a "virtual MIDI port" that can be used to send MIDI messages between applications.

<a name="macos"></a>
### macOS

1. Open the built-in `Audio MIDI Setup` application (under `/Applications/Utilities`)
2. Go to the `MIDI Studio` window (menu: `Window -> Show MIDI Studio`)
3. Double click `IAC Driver` to open the `IAC Driver Properties` window 
4. Make sure `Device is online` is checked 
5. Click `More information` to expand the `IAC Driver Properties` window   
6. Click `+` to add a port and name it whatever you want.

![screen shot of inter-App MIDI ports on macOS](https://raw.githubusercontent.com/adamjmurray/chorus.js/master/etc/img/virtual-midi-macos.png?1)

In this screen shot, I named my MIDI port `virtual1`. Now I can send chorus.js MIDI over this port by running:

    node my-chorus-script.js -p virtual1

<a name="windows"></a>
### Windows

1. Install [loopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html)
2. Run loopMIDI and click `+` to add a virtual MIDI port
3. When you run chorus, use the loopMIDI port:

        node node_modules/chorus/examples/play-song -p loopmidi


<a name="linux"></a>
### Linux

Not sure... I don't have a music-capable Linux machine to test with. In can work, in theory.

Try the [JACK Audio Connection Kit](http://jackaudio.org/)   

Know how to improve these instructions? Send a [pull request on github](https://github.com/adamjmurray/chorus.js/pulls).

<a name="daw-setup"></a>
## DAW Setup

Most DAWs listen to all MIDI inputs by default, so chorus.js should work with your DAW without any special setup.

You might want to use a more advanced setup, so let's take a look at some options:

![screen shot of DAW MIDI input settings](https://raw.githubusercontent.com/adamjmurray/chorus.js/master/etc/img/daw-midi-input.png)

This screen shot shows 3 ways of setting MIDI input in Ableton Live.

* All MIDI Inputs / All Channels (left track)

  Use the track defaults and the track will receive any MIDI input, including chorus.js

* Specific MIDI Inputs / All Channels (middle track)

  If you want to chorus.js along side another MIDI input, you'll need to set each track to use the desired MIDI input.
  For example, you'd do this if you want to jam along with chorus.js using a MIDI keyboard.
  Whichever tracks should receive chorus.js input, and only chorus.js input, are set to receive MIDI on the virtual MIDI port
  we created above (I named mine "virtual1").

* Specific MIDI Inputs / specific port (right track)

  If you want to make multi-track music with multiple instruments (each Part in a chorus.js Song can control a different instrument)
  then you need to route specific chorus.js MIDI channels to specific tracks. Most DAWs let you choose the MIDI port on the track input.
  If you are using Bitwig studio, you'll need to install something like [Tom's Bitwig Scripts](https://github.com/ThomasHelzle/Toms_Bitwig_Scripts).

<a name="next-steps"></a>
## Next Steps

Next is the {@tutorial 02-pitch} tutorial.