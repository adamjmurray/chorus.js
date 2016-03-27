'use strict';

const clamp = require('../utils').clamp;

module.exports = class Duration {
  constructor(value) {
    this['@type'] = 'Duration';
    this.value = clamp(value, 0);
  }
};
