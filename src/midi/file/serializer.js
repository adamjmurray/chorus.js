const MIDIFILE = require('./constants');
const ByteArray = require('./byte-array');

class MIDIFileSerializer {

  constructor(midiJSON) {
    this.midiJSON = midiJSON;
  }

  toUint8Array() {
    const header = Object.assign({format: 1, division: MIDIFILE.DEFAULT_DIVISION}, this.midiJSON.header);
    const tracks = this.midiJSON.tracks;
    this.ticksPerBeat = header.division;
    header.ntracks = tracks.length;
    let bytes = new ByteArray();

    bytes.writeInt32(MIDIFILE.HEADER_CHUNK_ID);
    bytes.writeInt32(6);
    bytes.writeInt16(header.format);
    bytes.writeInt16(header.ntracks);
    bytes.writeInt16(header.division);

    for (const track of tracks) {
      bytes = bytes.concat(this.trackBytes(track));
    }
    return new Uint8Array(bytes);
  }

  trackBytes(rawTrack) {
    const track = this.normalizeNoteEvents(rawTrack);
    const bytes = new ByteArray();
    let timeInTicks = 0;
    let nextTimeInTicks;
    let deltaTimeInTicks;
    for (const event of track) {
      nextTimeInTicks = Math.round(event.time * this.ticksPerBeat);
      deltaTimeInTicks = nextTimeInTicks - timeInTicks;
      timeInTicks = nextTimeInTicks;
      bytes.writeVariableLengthQuantity(deltaTimeInTicks);
      // console.log('writing event', event);
      const channelByte = (event.channel - 1) & 0x0F;
      switch (event.type) {
        case MIDIFILE.NOTE_ON:
          bytes.writeInt8(MIDIFILE.NOTE_ON_BYTE | channelByte);
          // TODO: I think we need a writeInt7 that does & 0x7F, for safety
          // Maybe we should clamp to 0,127 and/or issue a warning when value is out of range
          bytes.writeInt8(event.pitch);
          bytes.writeInt8(event.velocity); // TODO: might want to do Math.round here?
          break;
        case MIDIFILE.NOTE_OFF:
          bytes.writeInt8(MIDIFILE.NOTE_OFF_BYTE | channelByte);
          bytes.writeInt8(event.pitch);
          bytes.writeInt8(event.velocity);
          break;
        case MIDIFILE.TRACK_END:
          bytes.writeInt8(MIDIFILE.META_EVENT);
          bytes.writeInt8(MIDIFILE.TRACK_END_BYTE);
          bytes.writeVariableLengthQuantity(0);
          break;
        default:
          throw `Event type ${event.type} not supported yet`
      }
    }

    const trackHeadBytes = new ByteArray();
    trackHeadBytes.writeInt32(MIDIFILE.TRACK_CHUNK_ID);
    trackHeadBytes.writeInt32(bytes.length);
    return trackHeadBytes.concat(bytes);
  }

  // split note events into note on and note off events
  normalizeNoteEvents(rawTrack) {
    const track = [];
    for (const event of rawTrack) {
      if (event.type === MIDIFILE.NOTE) {
        track.push({
          time: event.time,
          type: MIDIFILE.NOTE_ON,
          pitch: event.pitch,
          velocity: event.velocity,
          channel: event.channel,
        });
        track.push({
          time: event.time + event.duration,
          type: MIDIFILE.NOTE_OFF,
          pitch: event.pitch,
          velocity: event.release || 0,
          channel: event.channel,
        });
      }
      else track.push(event);
    }
    return track.sort((a, b) => a.time - b.time);
  }

}

module.exports = MIDIFileSerializer;
