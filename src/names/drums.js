const Pitch = require('../model/pitch');

module.exports = Object.freeze({
  KICK: new Pitch(36),
  RIM: new Pitch(37),
  SNARE: new Pitch(38),
  CLAP: new Pitch(39),
  CLOSED_HIHAT: new Pitch(42),
  OPEN_HIHAT: new Pitch(46),
  CYMBAL: new Pitch(49),
});
