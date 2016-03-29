'use strict';
const KEY_NAMES_BY_VALUE = Object.freeze({
  0: 'C',
  1: 'G',
  2: 'D',
  3: 'A',
  4: 'E',
  5: 'B',
  6: 'F#',
  7: 'C#',
  '-1': 'F',
  '-2': 'Bb',
  '-3': 'Eb',
  '-4': 'Ab',
  '-5': 'Db',
  '-6': 'Gb',
  '-7': 'Cb'
});

const KEY_VALUES_BY_NAME = {};
Object.keys(KEY_NAMES_BY_VALUE).forEach(value => {
  KEY_VALUES_BY_NAME[KEY_NAMES_BY_VALUE[value]] = value;
});
Object.freeze(KEY_VALUES_BY_NAME);

module.exports = Object.freeze({

  HEADER_CHUNK_ID: 0x4D546864, // "MThd"
  TRACK_CHUNK_ID: 0x4D54726B, // "MTrk"
  DEFAULT_DIVISION: 960,

  MICROSECONDS_PER_MINUTE: 60000000,

  // TODO: append _BYTE to names for consistency with below
  META_EVENT: 0xFF,
  SYSEX_EVENT: 0xF0,
  SYSEX_CHUNK: 0xF7, // a continuation of a normal SysEx event

  // Meta event types
  SEQUENCE_NUMBER: 'sequence-number',
  SEQUENCE_NUMBER_BYTE: 0x00,
  TEXT: 'text',
  TEXT_BYTE: 0x01,
  COPYRIGHT: 'copyright',
  COPYRIGHT_BYTE: 0x02,
  SEQUENCE_NAME: 'sequence-name',
  SEQUENCE_NAME_BYTE: 0x03,
  INSTRUMENT_NAME: 'instrument-name',
  INSTRUMENT_NAME_BYTE: 0x04,
  LYRICS: 'lyrics',
  LYRICS_BYTE: 0x05,
  MARKER: 'marker',
  MARKER_BYTE: 0x06,
  CUE_POINT: 'cue-point',
  CUE_POINT_BYTE: 0x07,
  CHANNEL_PREFIX: 'channel-prefix',
  CHANNEL_PREFIX_BYTE: 0x20,
  TRACK_END: 'track-end',
  TRACK_END_BYTE: 0x2F,
  TEMPO: 'tempo',
  TEMPO_BYTE: 0x51,
  SMPTE_OFFSET: 'smpte-offset',
  SMPTE_OFFSET_BYTE: 0x54,
  TIME_SIGNATURE: 'time-signature',
  TIME_SIGNATURE_BYTE: 0x58,
  KEY_SIGNATURE: 'key-signature',
  KEY_SIGNATURE_BYTE: 0x59,
  SEQUENCE_SPECIFIC: 'sequence-specific',
  SEQUENCE_SPECIFIC_BYTE: 0x7F,

  // Channel event (message) types
  NOTE: 'note',
  NOTE_OFF: 'note-off',
  NOTE_OFF_BYTE: 0x80,
  NOTE_ON: 'note-on',
  NOTE_ON_BYTE: 0x90,
  NOTE_AFTERTOUCH: 'note-aftertouch',
  NOTE_AFTERTOUCH_BYTE: 0xA0,
  CONTROLLER: 'controller',
  CONTROLLER_BYTE: 0xB0,
  PROGRAM_CHANGE: 'program-change',
  PROGRAM_CHANGE_BYTE: 0xC0,
  CHANNEL_AFTERTOUCH: 'channel-aftertouch',
  CHANNEL_AFTERTOUCH_BYTE: 0xD0,
  PITCH_BEND: 'pitch-bend',
  PITCH_BEND_BYTE: 0xE0,

  KEY_NAMES_BY_VALUE,
  KEY_VALUES_BY_NAME,
});
