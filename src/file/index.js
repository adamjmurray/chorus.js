'use strict';
const fs = require('fs');
const MIDIFileReader = require('./reader');
const MIDIFileWriter = require('./writer');
const MIDI = require('./constants');

function readMIDIFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (error, buffer) => {
      if (error) reject(error);
      const arrayBuffer = new Uint8Array(buffer).buffer;
      const reader = new MIDIFileReader(arrayBuffer);
      resolve(reader.toJSON());
    });
  });
}

function writeMIDIFile(filepath, midiJSON) {
  const uint8Array = new MIDIFileWriter(midiJSON).toUint8Array();
  var buffer = new Buffer(uint8Array);
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, buffer, (error) => {
      if (error) reject(error);
      resolve();
    })
  });
}

module.exports = {
  readMIDIFile,
  writeMIDIFile,
  MIDI,
};
