const midi = require('midi');
const { NOTE_ON, NOTE_OFF } = require('./constants');

class MIDIIn {
  constructor() {
    this.input = new midi.input();
    this.isOpen = false;
    process.on('exit', () => this.close());
  }

  ports() {
    const count = this.input.getPortCount();
    const names = [];
    for (let i=0; i < count; i++) {
      names.push(this.input.getPortName(i));
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
        console.log(`Opening MIDI input port[${portIndex}]: ${portName}`);
        this.input.openPort(portIndex);
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
      console.log(`Closing MIDI input port[${this.portIndex}]: ${this.portName}`);
      this.input.closePort();
      this.isOpen = false;
      this.portIndex = null;
      this.portName = null;
    }
    return !this.isOpen;
  }

  onMessage(callback) {
    this.input.on('message', (deltaTime, message) => {
      // The message is an array of numbers corresponding to the MIDI bytes:
      //   [status, data1, data2]
      // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
      // information interpreting the messages.
      callback(message);
    });
  }

}

module.exports = MIDIIn;
