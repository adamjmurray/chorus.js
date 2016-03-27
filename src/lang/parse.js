'use strict';
const fs = require('fs');
const grammar = fs.readFileSync(`${__dirname}/grammar.pegjs`, 'utf8');
const PEG = require('pegjs');
const parser = PEG.buildParser(grammar);
module.exports = parser.parse;
