const midi = require('midi');
const { NOTE_ON, NOTE_OFF } = require('./constants');
const { sequentialAsync, sleep } = require('../utils');
const Scheduler = require('./scheduler');
const selectOutput = require('./select-output');

/**
 * Realtime MIDI output.
 */
class MidiOut {

  /**
   *
   * @param options TODO
   */
  constructor({ defaultDuration=500 }={}) {
    this.output = new midi.output();
    this.isOpen = false;
    this.defaultDuration = defaultDuration;
    process.on('beforeExit', () => this.panic().then(() => this.close()));
    process.on('exit', () => this.close());
    process.on('SIGINT', () => this.panic().then(() => process.exit(130)));
  }

  /**
   * List available MIDI input ports
   */
  ports() {
    const count = this.output.getPortCount();
    const names = [];
    for (let i=0; i < count; i++) {
      names.push(this.output.getPortName(i));
    }
    return names;
  }

  /**
   * Open a MIDI input port
   * @param selector TODO
   * @returns {boolean} true if the port was opened
   */
  open(selector = 0) {
    if (!this.isOpen) {
      if (typeof selector === 'number') {
        return this.openByPortIndex(selector);
      }
      else if (selector.constructor === RegExp) {
        const portIndex = this.ports().findIndex(portName => portName.match(selector));
        if (portIndex >= 0) {
          return this.openByPortIndex(portIndex);
        }
      }
      else {
        const portIndex = this.ports().findIndex(portName => portName == selector);
        if (portIndex >= 0) {
          return this.openByPortIndex(portIndex);
        }
      }
    }
    return false;
  }

  openByPortIndex(portIndex) {
    if (!this.isOpen) {
      const portName = this.ports()[portIndex];
      if (portName) {
        console.log(`Opening MIDI output port[${portIndex}]: ${portName}`);
        this.output.openPort(portIndex);
        this.isOpen = true;
        this.portIndex = portIndex;
        this.portName = portName;
        return true;
      }
    }
    return false;
  }

  /**
   * Select the MIDI output interactively, or via a command line argument or environment variable.
   * @param constructorOptions options object passed to the [constructor]{@link MidiOut}.
   * @returns {Promise} a Promise object that resolves to a MidiOut instance
   * @example
   * # chorus-script.js
   * const { Song } = require('chorus');
   * const { MidiOut } = require('chorus/midi');
   * const song = new Song(...);
   * MidiOut.select().then(midiOut => midiOut.play(song));
   *
   * ____________________________________________________
   * # command line usage
   *
   * # realtime output with the given port:
   * node chorus-script.js -p midiPortName
   *
   * # or via an environment variable:
   * CHORUS_OUTPUT_PORT=midiPortName node chorus-script.js
   *
   * # file output:
   * node chorus-script.js -f midiFileName
   */
  static select(constructorOptions) {
    return selectOutput(constructorOptions);
  }

  /**
   * Close the MIDI input port
   * @returns {boolean} true if the port was closed
   */
  close() {
    if (this.isOpen) {
      console.log(`Closing MIDI output port[${this.portIndex}]: ${this.portName}`);
      this.output.closePort();
      this.isOpen = false;
      this.portIndex = null;
      this.portName = null;
    }
    return !this.isOpen;
  }

  /**
   * Send a raw byte list
   * @param bytes {Iterable}
   */
  send(...bytes) {
    //if (!this.isOpen) return false;
    this.output.sendMessage(bytes);
    //return true;
  }

  /**
   * Send a note on message
   * @param pitch
   * @param velocity
   * @param channel
   */
  noteOn(pitch, velocity=70, channel=1) {
    this.send(NOTE_ON | (channel-1), Number(pitch), velocity);
  }

  /**
   * Send a note off message
   * @param pitch
   * @param velocity
   * @param channel
   */
  noteOff(pitch, velocity=70, channel=1) {
    this.send(NOTE_OFF | (channel-1), Number(pitch), velocity);
  }

  /**
   * Send a note on, followed by a note off after the given duration in milliseconds
   *
   * NOTE: This is a convenience method. The timing is not always predictable.
   *       It's recommend you explicitly schedule noteOn() and noteOff() calls when using the {@link Scheduler}.
   * @param pitch
   * @param velocity
   * @param duration
   * @param channel
   */
  note(pitch, velocity=70, duration=this.defaultDuration, channel=1) {
    // TODO: validation
    const pitchValue = Number(pitch); // coerce to a Number if needed (using Pitch.valueOf())
    this.noteOn(pitchValue, velocity, channel);
    setTimeout(() => this.noteOff(pitchValue, velocity, channel), duration)
  }

  /**
   * Turn off all notes for the given channel.
   * @param channel {Number} MIDI channel
   * @see [panic()]{@link MidiOut#panic}
   */
  allNotesOff(channel) {
    if (!this.isOpen || !channel) return;
    for (let pitch=0; pitch < 128; pitch++) {
      this.noteOff(pitch, 0, channel);
    }
  }

  /**
   * Turn off all notes that could possibly be playing. Fixes "stuck" notes.
   *
   * Called automatically when Node.js exits.
   *
   * Note: Due to MIDI rate-limiting, this operation happens asynchronously over a few milliseconds.
   * @returns {Promise}
   * @see [allNotesOff(channel)]{@link MidiOut#allNotesOff}
   */
  panic() {
    if (!this.isOpen) return Promise.resolve();
    // Calls all notes off channel-by-channel sequentially, with a delay in between
    // to avoid dropping note-off events due to MIDI rate-limiting.
    return sequentialAsync(
      new Array(16).fill(0).map((_,idx) =>
        () => {
          const channel = idx + 1;
          this.allNotesOff(channel);
          return sleep(5); // Seems like a 1ms delay can still result in stuck notes, so I made it a little longer.
        }
      )
    );
  }

  /**
   * Play a {@link Song} or MIDI JSON
   * @param songOrJSON {Song|object} a Song or MIDI JSON
   * @returns {Scheduler} A Scheduler that has already been started. It's returned so you can stop it early if desired.
   */
  play(songOrJSON) {
    const scheduler = new Scheduler();
    if (songOrJSON[Symbol.iterator]) {
      // it's a Song, iterate over all its events
      for (const event of songOrJSON) {
        if (event.type === 'bpm') {
          scheduler.bpm = event.value;
        }
        else if (event.type === 'note') {
          const { pitch, velocity, time, duration, channel } = event;
          scheduler.at(time, () => {
            this.noteOn(pitch, velocity, channel);
          });
          scheduler.at(time + duration, () => {
            this.noteOff(pitch, velocity, channel);
          });
        }
      }
    }
    else {
      // it's midiJSON
      const { bpm, tracks } = songOrJSON;
      scheduler.bpm = bpm;
      for (const track of tracks) {
        for (const event of track) {
          if (event.type === 'note') {
            const { pitch, velocity, time, duration, channel } = event;
            scheduler.at(time, () => {
              this.noteOn(pitch, velocity, channel);
            });
            scheduler.at(time + duration, () => {
              this.noteOff(pitch, velocity, channel);
            });
          }
        }
      }
    }
    scheduler.start();
    return scheduler; // so the caller can stop it if desired
  }
}

module.exports = MidiOut;
