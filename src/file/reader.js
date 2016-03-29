'use strict';
const MIDI = require('./constants');

module.exports = class MIDIFileReader {

  constructor(arrayBuffer) {
    this.arrayBuffer = arrayBuffer;
  }

  toJSON() {
    this.dataView = new DataView(this.arrayBuffer);
    this.byteOffset = 0;

    const header = this.readHeader();
    if (header.division & 0x8000) throw 'SMPTE time division format not supported';
    this.ticksPerBeat = header.division;

    const tracks = [];
    for (let i=0; i<header.ntracks; i++) {
      this.trackNumber = i + 1;
      tracks.push(this.readTrack());
    }

    return {
      header,
      tracks,
    }
  }

  nextUInt32() {
    const int32 = this.dataView.getUint32(this.byteOffset);
    this.byteOffset += 4;
    return int32;
  }

  nextUInt16() {
    const int16 = this.dataView.getUint16(this.byteOffset);
    this.byteOffset += 2;
    return int16;
  }

  nextUInt8() {
    const int8 = this.dataView.getUint8(this.byteOffset);
    this.byteOffset += 1;
    return int8;
  }

  backTrack(bytes) {
    this.byteOffset -= bytes;
  }

  readHeader() {
    if (this.nextUInt32() !== MIDI.HEADER_CHUNK_ID) throw 'MIDI format error: Invalid header chuck ID';
    const headerSize = this.nextUInt32();
    if (headerSize < 6) throw 'Invalid MIDI file: header must be at least 6 bytes';

    const format = this.nextUInt16();
    const ntracks = this.nextUInt16(); // number of tracks
    const division = this.nextUInt16();

    // ignore extra header bytes
    for (let i=6; i<headerSize; i++) this.nextUInt8();

    return {
      format,
      ntracks,
      division,
    }
  }

  readTrack() {
    if (this.nextUInt32() !== MIDI.TRACK_CHUNK_ID) throw 'MIDI format error: Invalid track chuck ID';

    const trackSize = this.nextUInt32();

    const track = {};
    this.timeInTicks = 0;
    this.notes = {};

    const endByte = this.byteOffset + trackSize;
    while (this.byteOffset < endByte) {
      const deltaTimeInTicks = this.readVariableLengthQuantity();
      this.timeInTicks += deltaTimeInTicks;

      const event = this.readEvent();
      // console.log(`at ${timeInTicks}, got ${JSON.stringify(event)}`);
      if (event) {
        let timeInTicks;
        if (event.timeInTicks == null) {
          timeInTicks = this.timeInTicks;
        } else {
          // special case for note on / note off pairs
          timeInTicks = event.timeInTicks;
          delete event.timeInTicks;
        }
        const timeInBeats = timeInTicks / this.ticksPerBeat;
        if (!track[timeInBeats]) track[timeInBeats] = [];
        track[timeInBeats].push(event);
      }
    }

    // TODO: warn about held notes (if DEBUG for this lib is enabled?)

    return track;
  }

  readEvent() {
    const eventType = this.nextUInt8();
    switch (eventType) {
      case MIDI.META_EVENT:
        return this.readMetaEvent();
      case MIDI.SYSEX_EVENT:
      case MIDI.SYSEX_CHUNK:
        throw 'Sysex not supported yet'; // TODO
      default:
        return this.readMessage(eventType);
    }
  }

  readMetaEvent() {
    const type = this.nextUInt8();
    let metaData;
    switch (type) {
      case MIDI.SEQUENCE_NUMBER_BYTE:
        return {
          type: MIDI.SEQUENCE_NUMBER,
          number: this.readMetaValue()
        };
      case MIDI.TEXT_BYTE:
        return {
          type: MIDI.TEXT,
          text: this.readMetaText()
        };
      case MIDI.COPYRIGHT_BYTE:
        return {
          type: MIDI.COPYRIGHT,
          text: this.readMetaText(),
        };
      case MIDI.SEQUENCE_NAME_BYTE:
        return {
          type: MIDI.SEQUENCE_NAME,
          text: this.readMetaText(),
        };
      case MIDI.INSTRUMENT_NAME_BYTE:
        return {
          type: MIDI.INSTRUMENT_NAME,
          text: this.readMetaText(),
        };
      case MIDI.LYRICS_BYTE:
        return {
          type: MIDI.LYRICS,
          text: this.readMetaText(),
        };
      case MIDI.MARKER_BYTE:
        return {
          type: MIDI.MARKER,
          text: this.readMetaText(),
        };
      case MIDI.CUE_POINT_BYTE:
        return {
          type: MIDI.CUE_POINT,
          text: this.readMetaText(),
        };
      case MIDI.CHANNEL_PREFIX_BYTE:
        return {
          type: MIDI.CHANNEL_PREFIX,
          channel: this.readMetaValue(),
        };
      case MIDI.TRACK_END_BYTE:
        this.readMetaData(); // should be empty
        return {
          type: MIDI.TRACK_END,
        };
      case MIDI.TEMPO_BYTE:
        return {
          type: MIDI.TEMPO,
          bpm: MIDI.MICROSECONDS_PER_MINUTE / this.readMetaValue(),
        };
      case MIDI.SMPTE_OFFSET_BYTE:
        return {
          type: MIDI.SMPTE_OFFSET,
          data: this.readMetaData(),
        };
      case MIDI.TIME_SIGNATURE_BYTE:
        // const [numerator, denominatorPower] = this.readMetaData();
        metaData = this.readMetaData();
        const numerator = metaData[0];
        const denominatorPower = metaData[1];
        return {
          type: MIDI.TIME_SIGNATURE,
          numerator: numerator,
          denominator: Math.pow(2, denominatorPower)
        };
      case MIDI.KEY_SIGNATURE_BYTE:
        // const [keyValue, scaleValue] = this.readMetaData();
        metaData = this.readMetaData();
        const keyValue = metaData[0];
        const scaleValue = metaData[1];
        const key = MIDI.KEY_NAMES_BY_VALUE[keyValue] || `unknown ${keyValue}`;
        const scale = scaleValue === 0 ? 'major' : scaleValue === 1 ? 'minor' : `unknown ${scaleValue}`;
        return {
          type: MIDI.KEY_SIGNATURE,
          key: key,
          scale: scale,
        };
      case MIDI.SEQUENCE_SPECIFIC_BYTE:
        return {
          type: MIDI.SEQUENCE_SPECIFIC,
          data: this.readMetaData(),
        };
      default:
        return {
          type: `unknown meta event 0x${type.toString(16)}`,
          data: this.readMetaData(),
        };
    }
  }

  readMetaValue() {
    const length = this.readVariableLengthQuantity();
    let value = 0;
    for (let i=0; i<length; i++) {
      value = (value << 8) + this.nextUInt8();
    }
    return value;
  }

  readMetaText() {
    return String.fromCharCode(...this.readMetaData());
  };

  readMetaData() {
    const length = this.readVariableLengthQuantity();
    const data = [];
    for (let i=0; i<length; i++) {
      data.push(this.nextUInt8());
    }
    return data;
  };


  readMessage(eventType) {
    let type;
    let channel;
    if (eventType & 0x80) {
      this.messageType = type = eventType & 0xF0;
      this.channel = channel = (eventType & 0x0F) + 1;
    }
    else {
      // This is a running status byte, reuse type and channel from last message:
      type = this.messageType;
      channel = this.channel;
      // And the byte we thought was eventType is really the next data byte, so backtrack
      this.backTrack(1);
    }

    let event;
    switch(type) {
      case MIDI.NOTE_ON_BYTE:
        this.readNoteOn();
        return null; // note event will be created via corresponding note off
      case MIDI.NOTE_OFF_BYTE:
        event = this.readNoteOff();
        break;
      case MIDI.NOTE_AFTERTOUCH_BYTE:
        event = {
          type: MIDI.NOTE_AFTERTOUCH,
          pitch: this.nextUInt8(),
          value: this.nextUInt8(),
        };
        break;
      case MIDI.CONTROLLER_BYTE:
        event = {
          type: MIDI.CONTROLLER,
          number: this.nextUInt8(),
          value: this.nextUInt8(),
        };
        break;
      case MIDI.PROGRAM_CHANGE_BYTE:
        event = {
          type: MIDI.PROGRAM_CHANGE,
          number: this.nextUInt8(),
        };
        break;
      case MIDI.CHANNEL_AFTERTOUCH_BYTE:
        event = {
          type: MIDI.CHANNEL_AFTERTOUCH,
          value: this.nextUInt8(),
        };
        break;
      case MIDI.PITCH_BEND_BYTE:
        event = {
          type: MIDI.PITCH_BEND,
          value: (this.nextUInt8() << 7) + this.nextUInt8(),
        };
        break;
      default:
        // TODO: handle "system realtime messages", etc
        // TODO: I think the correct thing to do here is to keep
        // reading bytes until we get to the next one where (byte & 0x80) is truthy, then backtrack
        throw `ERROR: unexpected message ${type}`;
    }
    event.channel = channel;
    return event;
  }

  readNoteOn() {
    const pitch = this.nextUInt8();
    const velocity = this.nextUInt8();
    if (velocity === 0) {
      // handle as a note off without an off velocity
      this.readNoteOff(pitch);
    }
    else {
      if (this.notes[pitch]) {
        // TODO, support this case?
        console.log(`Warning: ignoring overlapping note on track number ${this.trackNumber} for pitch ${pitch}`);
      }
      else {
        this.notes[pitch] = [velocity, this.timeInTicks];
      }
    }
    return null; /// we'll create a "note" event when we see the corresponding note_off
  }

  readNoteOff(pitch) {
    let release;
    if (pitch == null) {
      pitch = this.nextUInt8();
      release = this.nextUInt8(); // AKA off velocity
    } // else pitch was passed in from readNoteOn() when a velocity of 0 was encountered

    if (this.notes[pitch]) {
      // const [velocity, startTime] = this.notes[pitch];
      const pitchData = this.notes[pitch];
      const velocity = pitchData[0];
      const startTime = pitchData[1];
      delete this.notes[pitch];
      const event = {
        type: MIDI.NOTE,
        pitch: pitch,
        velocity: velocity,
        duration: (this.timeInTicks - startTime) / this.ticksPerBeat,
      };
      if (release != null) event.release = release;
      event.timeInTicks = startTime; // special case, readTrack() should use this instead of it's time offset
      return event;
    }
    else console.log(`Warning: ignoring unmatched note off event on track ${this.trackNumber} for pitch ${pitch}`);
  }

  readVariableLengthQuantity() {
    let data = 0;
    let byte = this.nextUInt8();
    while (byte & 0x80) {
      data = (data << 7) + (byte & 0x7F);
      byte = this.nextUInt8();
    }
    return (data << 7) + (byte & 0x7F);
  };
};
