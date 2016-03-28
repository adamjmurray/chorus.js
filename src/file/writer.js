'use strict';
const MIDI = require('./constants');

module.exports = class MIDIFileWriter {

  constructor(midiJSON) {
    this.midiJSON = midiJSON;
  }

  toUint8Array() {
    const header = Object.assign({format: 1, division: MIDI.DEFAULT_DIVISION}, this.midiJSON.header);
    const tracks = this.midiJSON.tracks;
    this.ticksPerBeat = header.division;
    header.ntracks = tracks.length;

    let bytes = this.toHeaderBytes(header);
    console.log('header bytes after return', bytes);
    tracks.forEach(track => {
      bytes = bytes.concat(this.toTrackBytes(track));
    });

    console.log('created byte array of length', bytes.length);

    return new Uint8Array(bytes);
  }

  writeInt32(bytes, int32) {
    bytes.push((int32 & 0xFF000000) >> 24);
    bytes.push((int32 & 0x00FF0000) >> 16);
    bytes.push((int32 & 0x0000FF00) >> 8);
    bytes.push(int32 & 0x000000FF);
  }

  writeInt16(bytes, int16) {
    bytes.push((int16 & 0xFF00) >> 8);
    bytes.push(int16 & 0x00FF);
  }

  writeInt8(bytes) {
    bytes.push(int8 & 0xFF);
  }

  toHeaderBytes(header) {
    const bytes = [];
    this.writeInt32(bytes, MIDI.HEADER_CHUNK_ID);
    this.writeInt32(bytes, 6);
    this.writeInt16(bytes, header.format);
    this.writeInt16(bytes, header.ntracks);
    this.writeInt16(bytes, header.division);
    console.log('header bytes', bytes.length);
    return bytes;
  }

  toTrackBytes(track) {
    const bytes = [];
    this.writeInt32(bytes, MIDI.TRACK_CHUNK_ID);
    this.writeInt32(bytes, 0);

    const timeOffsets = Object
      .keys(track)
      .map(parseFloat)
      .filter(number => !isNaN(number))
      .sort();

    console.log('got timeOffsets', timeOffsets);

    return bytes;
  }
};
