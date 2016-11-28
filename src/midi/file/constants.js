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

const byteConstants = {
  // Meta events
  SEQUENCE_NUMBER_BYTE: 0x00,
  TEXT_BYTE: 0x01,
  COPYRIGHT_BYTE: 0x02,
  SEQUENCE_NAME_BYTE: 0x03,
  INSTRUMENT_NAME_BYTE: 0x04,
  LYRICS_BYTE: 0x05,
  MARKER_BYTE: 0x06,
  CUE_POINT_BYTE: 0x07,
  CHANNEL_PREFIX_BYTE: 0x20,
  TRACK_END_BYTE: 0x2F,
  TEMPO_BYTE: 0x51,
  SMPTE_OFFSET_BYTE: 0x54,
  TIME_SIGNATURE_BYTE: 0x58,
  KEY_SIGNATURE_BYTE: 0x59,
  SEQUENCE_SPECIFIC_BYTE: 0x7F,

  // Channel events (messages)
  NOTE_OFF_BYTE: 0x80,
  NOTE_ON_BYTE: 0x90,
  NOTE_AFTERTOUCH_BYTE: 0xA0,
  CONTROLLER_BYTE: 0xB0,
  PROGRAM_CHANGE_BYTE: 0xC0,
  CHANNEL_AFTERTOUCH_BYTE: 0xD0,
  PITCH_BEND_BYTE: 0xE0,
};

const typeConstants = {};
const TYPES_BY_BYTE = {};
for (const byteConstantKey of Object.keys(byteConstants)) {
  const typeConstantKey = byteConstantKey.slice(0,-5); // remove _BYTE suffix
  const typeConstant = typeConstantKey.replace(/_/g,'-').toLowerCase();
  typeConstants[typeConstantKey] = typeConstant;
  TYPES_BY_BYTE[byteConstants[byteConstantKey]] = typeConstant;
}

module.exports = Object.freeze(Object.assign({
  HEADER_CHUNK_ID: 0x4D546864, // "MThd"
  TRACK_CHUNK_ID: 0x4D54726B, // "MTrk"
  DEFAULT_DIVISION: 960,
  MICROSECONDS_PER_MINUTE: 60000000,
  // TODO: append _BYTE to names for consistency
  META_EVENT: 0xFF,
  SYSEX_EVENT: 0xF0,
  SYSEX_CHUNK: 0xF7, // a continuation of a normal SysEx event
  NOTE: 'note',
  TYPES_BY_BYTE,
  KEY_NAMES_BY_VALUE,
  KEY_VALUES_BY_NAME,
}, byteConstants, typeConstants));
