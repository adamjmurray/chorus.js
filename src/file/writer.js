const MIDI = require('./constants');
const ByteArray = require('./byte-array');

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

  toHeaderBytes(header) {
    const bytes = new ByteArray();
    bytes.writeInt32(MIDI.HEADER_CHUNK_ID);
    bytes.writeInt32(6);
    bytes.writeInt16(header.format);
    bytes.writeInt16(header.ntracks);
    bytes.writeInt16(header.division);
    return bytes;
  }

  toTrackBytes(rawTrack) {
    const track = this.normalizeNoteEvents(rawTrack);
    const bytes = new ByteArray();
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
        bytes.writeVariableLengthQuantity(deltaTimeInTicks);
        deltaTimeInTicks = 0;

        // console.log('writing event', event);
        const channelByte = (event.channel - 1) & 0x0F;
        switch (event.type) {
          case MIDI.NOTE_ON:
            bytes.writeInt8(MIDI.NOTE_ON_BYTE | channelByte);
            // TODO: I think we need a writeInt7 that does & 0x7F, for safety
            // Maybe we should clamp to 0,127 and/or issue a warning when value is out of range
            bytes.writeInt8(event.pitch);
            bytes.writeInt8(event.velocity);
            break;
          case MIDI.NOTE_OFF:
            bytes.writeInt8(MIDI.NOTE_OFF_BYTE | channelByte);
            bytes.writeInt8(event.pitch);
            bytes.writeInt8(event.velocity);
            break;
          case MIDI.TRACK_END:
            bytes.writeInt8(MIDI.META_EVENT);
            bytes.writeInt8(MIDI.TRACK_END_BYTE);
            bytes.writeVariableLengthQuantity(0);
            break;
          default:
            throw `Event type ${event.type} not supported yet`
        }
      }
    }

    const trackHeadBytes = new ByteArray();
    trackHeadBytes.writeInt32(MIDI.TRACK_CHUNK_ID);
    trackHeadBytes.writeInt32(bytes.length);
    return trackHeadBytes.concat(bytes);
  }

  // split note events into note on and note off events
  normalizeNoteEvents(rawTrack) {
    const track = JSON.parse(JSON.stringify(rawTrack)); // deep clone
    // console.log('track', JSON.stringify(track, null, 2));

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
    return track;
  }

}

module.exports = MIDIFileWriter;
