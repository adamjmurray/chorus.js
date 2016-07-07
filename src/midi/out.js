const midi = require('midi');
const { NOTE_ON, NOTE_OFF } = require('./constants');
const Scheduler = require('../time/scheduler');

/**
 * Realtime MIDI output.
 */
class MIDIOut {

  /**
   *
   * @param options TODO
   */
  constructor(options = {}) {
    this.output = new midi.output();
    this.isOpen = false;
    this.defaultDuration = options.defaultDuration || 500;
    process.on('exit', () => {
      this.allNotesOff();
      this.close()
    });
    process.on('SIGINT', () => {
      // trigger on exit behavior
      process.exit(130);
    });
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
  noteOn(pitch, velocity=70, channel=0) {
    this.send(NOTE_ON | channel, pitch, velocity);
  }

  /**
   * Send a note off message
   * @param pitch
   * @param velocity
   * @param channel
   */
  noteOff(pitch, velocity=70, channel=0) {
    this.send(NOTE_OFF | channel, pitch, velocity);
  }

  /**
   * Send a note on, followed by a note off after the given duration in milliseconds
   * @param pitch
   * @param velocity
   * @param duration
   * @param channel
   */
  note(pitch, velocity=70, duration=this.defaultDuration, channel=0) {
    if (pitch.value) pitch = pitch.value;
    this.noteOn(pitch, velocity, channel);
    setTimeout(() => this.noteOff(pitch, velocity, channel), duration)
  }

  /**
   * Turn off all notes. Can fix "stuck" notes. Called automatically when Node.js exits.
   */
  allNotesOff() {
    for (let channel=0; channel < 16; channel++) {
      for (let pitch=0; pitch < 128; pitch++) {
        this.noteOff(pitch, 0, channel);
      }
    }
  }

  play(songOrJSON) {
    const scheduler = new Scheduler();
    if (songOrJSON[Symbol.iterator]) {
      let bpm = 120; // TODO: make this default a constant? We are using it in a few places
      // it's a Song, iterate over all its events
      for (const event of songOrJSON) {
        if (event.type === 'bpm') {
          bpm = scheduler.bpm = event.value;
        } // TODO: we could look for the time property and schedule tempo changes
        else if (event.type === 'note') {
          scheduler.at(event.time, () => {
            this.note(event.pitch, event.velocity, event.duration * 60000/bpm, event.channel);
          })
        }
      }
    }
    else {
      // it's midiJSON
      const { bpm, tracks } = songOrJSON;
      scheduler.bpm = bpm;
      for (const track of tracks) {
        const times = Object
          .keys(track)
          .map(parseFloat)
          .filter(number => !isNaN(number))
          .sort((a, b) => a - b);
        for (const time of times) {
          for (const event of track[time]) {
            if (event.type === 'note') {
              scheduler.at(time, () => {
                this.note(event.pitch, event.velocity, event.duration * 60000 / bpm, event.channel);
              })
            }
          }
        }
      }
    }
    scheduler.start();
    return scheduler; // so the caller can stop it if desired
  }
}

module.exports = MIDIOut;
