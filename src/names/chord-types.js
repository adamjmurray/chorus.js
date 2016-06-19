const CHORD_TYPES = {
  TRIAD: [0,2,4],
  INV1:  [0,2,5],
  INV2:  [0,3,5],
  SUS2:  [0,1,4],
  SUS4:  [0,2,3],
  FOURFIVE: [0,3,4],
  SEVENTH: [0,2,4,6],
  SEVENTH_INV1: [0,2,4,5],
  SEVENTH_INV2: [0,2,3,5],
  SEVENTH_INV3: [0,1,3,5],
};
Object.keys(CHORD_TYPES).forEach(name => Object.freeze(CHORD_TYPES[name]));

module.exports = Object.freeze(CHORD_TYPES);
