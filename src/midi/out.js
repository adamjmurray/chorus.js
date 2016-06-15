const midi = require('midi');
const { NOTE_ON, NOTE_OFF } = require('./constants');

class MIDIOut {

  constructor(options = {}) {
    this.output = new midi.output();
    this.isOpen = false;
    this.duration = options.duration || 500;
    process.on('exit', () => {
      this.allNotesOff();
      this.close()
    });
  }

  ports() {
    const count = this.output.getPortCount();
    const names = [];
    for (let i=0; i < count; i++) {
      names.push(this.output.getPortName(i));
    }
    return names;
  }

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

  send(...bytes) {
    //if (!this.isOpen) return false;
    this.output.sendMessage(bytes);
    //return true;
  }

  noteOn(pitch, velocity=70, channel=0) {
    this.send(NOTE_ON | channel, pitch, velocity);
  }

  noteOff(pitch, velocity=70, channel=0) {
    this.send(NOTE_OFF | channel, pitch, velocity);
  }

  note(pitch, velocity=70, duration=this.duration, channel=0) {
    if (pitch.midiValue) pitch = pitch.midiValue;
    this.noteOn(pitch, velocity, channel);
    setTimeout(() => this.noteOff(pitch, velocity, channel), duration)
  }

  allNotesOff() {
    for (let channel=0; channel < 16; channel++) {
      for (let pitch=0; pitch < 128; pitch++) {
        this.noteOff(pitch, 0, channel);
      }
    }
  }
}

module.exports = MIDIOut;
