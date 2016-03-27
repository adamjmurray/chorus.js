'use strict';

const mod = require('../utils').mod;

const PITCH_CLASS_VALUE = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

function invalid(string) {
  throw new Error(`Invalid PitchClass String: ${string}`)
}

module.exports = class PitchClass {
  constructor(value, name) {
    this.value = mod(value, 12);
    if (name) this.name = name;
  }

  static fromName(string) {
    if (string.length > 2) invalid(string);
    let name = string[0].toUpperCase();
    let value = PITCH_CLASS_VALUE[name];
    if (value == null) invalid(string);
    if (string.length == 2) {
      switch (string[1]) {
        case 'b': value--; break;
        case '#': value++; break;
        default: invalid(string);
      }
      name += string[1];
    }
    return new PitchClass(value, name);
  }
};
