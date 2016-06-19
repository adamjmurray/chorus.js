const midi = require('midi');
const { NOTE_ON, NOTE_OFF } = require('./constants');

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
}

module.exports = MIDIOut;
