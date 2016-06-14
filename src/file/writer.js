const MIDI = require('./constants');

class MIDIFileWriter {

  constructor(midiJSON) {
    this.midiJSON = midiJSON;
  }

  toUint8Array() {
    const header = Object.assign({format: 1, division: MIDI.DEFAULT_DIVISION}, this.midiJSON.header);
    const tracks = this.midiJSON.tracks;
    this.ticksPerBeat = header.division;
    header.ntracks = tracks.length;

    let bytes = this.toHeaderBytes(header);
    tracks.forEach(track => {
      bytes = bytes.concat(this.toTrackBytes(track));
    });
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

  writeInt8(bytes, int8) {
    bytes.push(int8 & 0xFF);
  }

  writeVariableLengthQuantity(bytes, value) {
    if (value > 0x0FFFFFFF) {
      throw new Error(`Cannot write variable length quantity ${value} because it exceeds the maximum ${0x0FFFFFFF}`);
    }
    const buffer = [value & 0x7F];
    while (value >>= 7) buffer.push((value & 0x7f) | 0x80);
    buffer.reverse().forEach(byte => this.writeInt8(bytes, byte));
  };

  toHeaderBytes(header) {
    const bytes = [];
    this.writeInt32(bytes, MIDI.HEADER_CHUNK_ID);
    this.writeInt32(bytes, 6);
    this.writeInt16(bytes, header.format);
    this.writeInt16(bytes, header.ntracks);
    this.writeInt16(bytes, header.division);
    return bytes;
  }

  toTrackBytes(track) {
    // console.log('track', JSON.stringify(track, null, 2));
    track = JSON.parse(JSON.stringify(track)); // deep clone
    // split note events into note on and note off events
    for (let time of Object.keys(track)) {
      const events = track[time];
      time = parseFloat(time);
      events.forEach((event, index) => {
        if (event.type === MIDI.NOTE) {
          events[index] = {
            type: MIDI.NOTE_ON,
            pitch: event.pitch,
            velocity: event.velocity,
            channel: event.channel,
          };
          let noteOff;
          if (event.release != null) {
            noteOff = {
              type: MIDI.NOTE_OFF,
              pitch: event.pitch,
              velocity: event.release,
              channel: event.channel,
            }
          } else {
            noteOff = {
              type: MIDI.NOTE_ON,
              pitch: event.pitch,
              velocity: 0,
              channel: event.channel,
            }
          }
          const offTime = time + event.duration;
          if (!track[offTime]) track[offTime] = [];
          track[offTime].unshift(noteOff); // ensure we come before track-end
        }
      });
    }
    // console.log('processed track', JSON.stringify(track, null, 2));

    const bytes = [];
    const times = Object
      .keys(track)
      .map(parseFloat)
      .filter(number => !isNaN(number))
      .sort();

    // console.log('got timeOffsets', times);
    let timeInTicks = 0;
    let nextTimeInTicks;
    let deltaTimeInTicks;
    for (const timeInBeats of times) {
      nextTimeInTicks = Math.round(timeInBeats * this.ticksPerBeat);
      deltaTimeInTicks = nextTimeInTicks - timeInTicks;
      timeInTicks = nextTimeInTicks;

      for (const event of track[timeInBeats]) {
        this.writeVariableLengthQuantity(bytes, deltaTimeInTicks);
        this.writeEventBytes(bytes, event);
        deltaTimeInTicks = 0;
      }
    }

    const trackHeadBytes = [];
    this.writeInt32(trackHeadBytes, MIDI.TRACK_CHUNK_ID);
    this.writeInt32(trackHeadBytes, bytes.length);

    return trackHeadBytes.concat(bytes);
  }

  writeEventBytes(bytes, event) {
    // console.log('writing event', event);
    const channelByte = (event.channel - 1) & 0x0F;
    switch (event.type) {
      case MIDI.NOTE_ON:
        this.writeInt8(bytes, MIDI.NOTE_ON_BYTE | channelByte);
        // TODO: I think we need a writeInt7 that does & 0x7F, for safety
        // Maybe we should clamp to 0,127 and/or issue a warning when value is out of range
        this.writeInt8(bytes, event.pitch);
        this.writeInt8(bytes, event.velocity);
        break;
      case MIDI.NOTE_OFF:
        this.writeInt8(bytes, MIDI.NOTE_OFF_BYTE | channelByte);
        this.writeInt8(bytes, event.pitch);
        this.writeInt8(bytes, event.release);
        break;
      case MIDI.TRACK_END:
        this.writeInt8(bytes, MIDI.META_EVENT);
        this.writeInt8(bytes, MIDI.TRACK_END_BYTE);
        this.writeVariableLengthQuantity(bytes, 0);
        break;
      default:
        throw `Event type ${event.type} not supported yet`
    }
  }
}

module.exports = MIDIFileWriter;
