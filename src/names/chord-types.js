module.exports = Object.freeze({
  TRIAD: [0,2,4],
  TRIAD_INV1:  [0,2,5],
  TRIAD_INV2:  [0,3,5],
  TRIAD_SUS2:  [0,1,4],
  TRIAD_SUS4:  [0,3,4],
  TRIAD_PLUS_8: [0,2,7], // TODO it would be cool if this coud be +octave, but how to handle in microtonal music
  QUARTAL: [0,3,6],
  QUINTAL: [0,4,8],
  SIXTH: [0,2,4,5], // same as SEVENTH_INV1 // TODO: not sure I actually want to keep _INV* constants, esp if we do the proposal in the readme for refactoring
  SEVENTH: [0,2,4,6],
  SEVENTH_INV1: [0,2,4,5],
  SEVENTH_INV2: [0,2,3,5],
  SEVENTH_INV3: [0,1,3,5],
  NINTH: [0,2,4,6,8],
});
