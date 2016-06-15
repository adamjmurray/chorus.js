const MIDIFILE = require('./constants');
const ByteScanner = require('./byte-scanner');

class MIDIFileParser {

  constructor(arrayBuffer) {
    this.arrayBuffer = arrayBuffer;
  }

  toJSON() {
    this.next = new ByteScanner(this.arrayBuffer);
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

  readHeader() {
    if (this.next.uInt32() !== MIDIFILE.HEADER_CHUNK_ID) throw 'MIDI format error: Invalid header chuck ID';
    const headerSize = this.next.uInt32();
    if (headerSize < 6) throw 'Invalid MIDI file: header must be at least 6 bytes';

    const format = this.next.uInt16();
    const ntracks = this.next.uInt16(); // number of tracks
    const division = this.next.uInt16();

    // ignore extra header bytes
    for (let i=6; i<headerSize; i++) this.next.uInt8();

    return {
      format,
      ntracks,
      division,
    }
  }

  readTrack() {
    if (this.next.uInt32() !== MIDIFILE.TRACK_CHUNK_ID) throw 'MIDI format error: Invalid track chuck ID';

    const trackSize = this.next.uInt32();
    const track = {};
    this.timeInTicks = 0;
    this.notes = {};

    const end = this.next.position + trackSize;
    while (this.next.position < end) {
      const deltaTimeInTicks = this.next.variableLengthQuantity();
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
    const eventType = this.next.uInt8();
    switch (eventType) {
      case MIDIFILE.META_EVENT:
        return this.readMetaEvent();
      case MIDIFILE.SYSEX_EVENT:
      case MIDIFILE.SYSEX_CHUNK:
        throw 'Sysex not supported yet'; // TODO
      default:
        return this.readMessage(eventType);
    }
  }

  readMetaEvent() {
    const type = this.next.uInt8();
    let metaData;
    switch (type) {
      case MIDIFILE.SEQUENCE_NUMBER_BYTE:
        return {
          type: MIDIFILE.SEQUENCE_NUMBER,
          number: this.readMetaValue()
        };
      case MIDIFILE.TEXT_BYTE:
        return {
          type: MIDIFILE.TEXT,
          text: this.readMetaText()
        };
      case MIDIFILE.COPYRIGHT_BYTE:
        return {
          type: MIDIFILE.COPYRIGHT,
          text: this.readMetaText(),
        };
      case MIDIFILE.SEQUENCE_NAME_BYTE:
        return {
          type: MIDIFILE.SEQUENCE_NAME,
          text: this.readMetaText(),
        };
      case MIDIFILE.INSTRUMENT_NAME_BYTE:
        return {
          type: MIDIFILE.INSTRUMENT_NAME,
          text: this.readMetaText(),
        };
      case MIDIFILE.LYRICS_BYTE:
        return {
          type: MIDIFILE.LYRICS,
          text: this.readMetaText(),
        };
      case MIDIFILE.MARKER_BYTE:
        return {
          type: MIDIFILE.MARKER,
          text: this.readMetaText(),
        };
      case MIDIFILE.CUE_POINT_BYTE:
        return {
          type: MIDIFILE.CUE_POINT,
          text: this.readMetaText(),
        };
      case MIDIFILE.CHANNEL_PREFIX_BYTE:
        return {
          type: MIDIFILE.CHANNEL_PREFIX,
          channel: this.readMetaValue(),
        };
      case MIDIFILE.TRACK_END_BYTE:
        this.readMetaData(); // should be empty
        return {
          type: MIDIFILE.TRACK_END,
        };
      case MIDIFILE.TEMPO_BYTE:
        return {
          type: MIDIFILE.TEMPO,
          bpm: MIDIFILE.MICROSECONDS_PER_MINUTE / this.readMetaValue(),
        };
      case MIDIFILE.SMPTE_OFFSET_BYTE:
        return {
          type: MIDIFILE.SMPTE_OFFSET,
          data: this.readMetaData(),
        };
      case MIDIFILE.TIME_SIGNATURE_BYTE:
        // const [numerator, denominatorPower] = this.readMetaData();
        metaData = this.readMetaData();
        const numerator = metaData[0];
        const denominatorPower = metaData[1];
        return {
          type: MIDIFILE.TIME_SIGNATURE,
          numerator: numerator,
          denominator: Math.pow(2, denominatorPower)
        };
      case MIDIFILE.KEY_SIGNATURE_BYTE:
        // const [keyValue, scaleValue] = this.readMetaData();
        metaData = this.readMetaData();
        const keyValue = metaData[0];
        const scaleValue = metaData[1];
        const key = MIDIFILE.KEY_NAMES_BY_VALUE[keyValue] || `unknown ${keyValue}`;
        const scale = scaleValue === 0 ? 'major' : scaleValue === 1 ? 'minor' : `unknown ${scaleValue}`;
        return {
          type: MIDIFILE.KEY_SIGNATURE,
          key: key,
          scale: scale,
        };
      case MIDIFILE.SEQUENCE_SPECIFIC_BYTE:
        return {
          type: MIDIFILE.SEQUENCE_SPECIFIC,
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
    const length = this.next.variableLengthQuantity();
    let value = 0;
    for (let i=0; i<length; i++) {
      value = (value << 8) + this.next.uInt8();
    }
    return value;
  }

  readMetaText() {
    return String.fromCharCode(...this.readMetaData());
  };

  readMetaData() {
    const length = this.next.variableLengthQuantity();
    const data = [];
    for (let i=0; i<length; i++) {
      data.push(this.next.uInt8());
    }
    return data;
  };

  readMessage(eventType) {
    let type;
    let channel;
    if (eventType & 0x80) {
      type = this.messageType = eventType & 0xF0;
      channel = this.channel = (eventType & 0x0F) + 1;
    }
    else {
      // This is a running status byte, reuse type and channel from last message:
      type = this.messageType;
      channel = this.channel;
      // And the byte we thought was eventType is really the next data byte, so backtrack
      this.next.backtrack(1);
    }

    let event;
    switch(type) {
      case MIDIFILE.NOTE_ON_BYTE:
        this.readNoteOn();
        return null; // note event will be created via corresponding note off
      case MIDIFILE.NOTE_OFF_BYTE:
        event = this.readNoteOff();
        break;
      case MIDIFILE.NOTE_AFTERTOUCH_BYTE:
        event = {
          type: MIDIFILE.NOTE_AFTERTOUCH,
          pitch: this.next.uInt8(),
          value: this.next.uInt8(),
        };
        break;
      case MIDIFILE.CONTROLLER_BYTE:
        event = {
          type: MIDIFILE.CONTROLLER,
          number: this.next.uInt8(),
          value: this.next.uInt8(),
        };
        break;
      case MIDIFILE.PROGRAM_CHANGE_BYTE:
        event = {
          type: MIDIFILE.PROGRAM_CHANGE,
          number: this.next.uInt8(),
        };
        break;
      case MIDIFILE.CHANNEL_AFTERTOUCH_BYTE:
        event = {
          type: MIDIFILE.CHANNEL_AFTERTOUCH,
          value: this.next.uInt8(),
        };
        break;
      case MIDIFILE.PITCH_BEND_BYTE:
        event = {
          type: MIDIFILE.PITCH_BEND,
          value: (this.next.uInt8() << 7) + this.next.uInt8(),
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
    const pitch = this.next.uInt8();
    const velocity = this.next.uInt8();
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
      pitch = this.next.uInt8();
      release = this.next.uInt8(); // AKA off velocity
    } // else pitch was passed in from readNoteOn() when a velocity of 0 was encountered

    if (this.notes[pitch]) {
      // const [velocity, startTime] = this.notes[pitch];
      const pitchData = this.notes[pitch];
      const velocity = pitchData[0];
      const startTime = pitchData[1];
      delete this.notes[pitch];
      const event = {
        type: MIDIFILE.NOTE,
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

}

module.exports = MIDIFileParser;
