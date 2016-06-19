const fs = require('fs');
const grammar = fs.readFileSync(`${__dirname}/grammar.pegjs`, 'utf8');
const PEG = require('pegjs');
var Tracer = require('pegjs-backtrace');
const parser = PEG.buildParser(grammar, { trace: true });

// TODO: hide tracer behavior behind a constructor argument

/**
 * Parse the music pattern syntax.
 */
class Parser {
  parse(input) {
    const tracer = new Tracer(input);
    try {
      return parser.parse(input, { tracer });
    } catch (err) {
      console.error(tracer.getBacktraceString());
    }
  }
}

module.exports = Parser;
