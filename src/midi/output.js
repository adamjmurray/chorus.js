/* eslint no-console: off */

const readline = require('readline');
const { basename } = require('path');
const MidiFile = require('./file');
const pkg = require('../../package');

let cli;
let outputPortArgOrEnvVar;
let outputFile;
for (let i=2; i<process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '-p') outputPortArgOrEnvVar = process.argv[++i] || '';
  if (arg === '-f') outputFile = process.argv[++i];
}
if (outputPortArgOrEnvVar == null) outputPortArgOrEnvVar = process.env.CHORUS_OUTPUT_PORT;

function usage() {
  console.log(`
Usage

File output: node node_modules/chorus/examples/${basename(process.argv[1])} -f [outputFile]

Realtime output: node node_modules/chorus/examples/${basename(process.argv[1])} -p [outputPort]

Or set outputPort with the environment variable CHORUS_OUTPUT_PORT

No MIDI output specified.\n`);
}

function findPortMatches(ports, substrings) {
  return ports.filter(port => substrings.find(substring => port.toLowerCase().includes(substring)));
}

function findPort(ports, portSearch) {
  return new Promise((resolve, reject) => {
    portSearch = portSearch.toLowerCase();
    let matches = findPortMatches(ports, [portSearch]);
    if (!matches.length) {
      matches = findPortMatches(ports, portSearch.split(/\s+/));
    }
    switch (matches.length) {
      case 0:
        console.log('No port found:', portSearch);
        return reject();
      case 1:
        return resolve(matches[0]);
      default:
        console.log('Found multiple ports:');
        return reject(matches);
    }
  });
}

function selectPort(ports) {
  return new Promise((resolve, reject) => {
    console.log(' ', ports.join('\n  '));
    cli.question('Which port? ', portSearch => {
      findPort(ports, portSearch)
        .then(resolve)
        .catch(matches => (matches ? resolve(selectPort(matches)) : reject()));
    });
  });
}

function selectAndOpenOutput(midiOut, portSearch) {
  if (!cli) cli = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ports = midiOut.ports();
  if (!portSearch) console.log('MIDI output ports:');
  return (portSearch ? findPort(ports, portSearch) : selectPort(ports))
    .then(port => {
      cli.close();
      cli = null;
      midiOut.open(port);
      return midiOut
    })
    .catch(() => selectAndOpenOutput(midiOut));
}

/**
 * Provides a MIDI realtime or file output to play/write a Song.
 */
class Output {

  /**
   * Select the MIDI output interactively, or via a command line argument or environment variable.
   * @param constructorOptions options object passed to the [constructor]{@link MidiOut}.
   * @returns {Promise} a Promise object that resolves to a MidiOut instance
   * @example
   * # chorus-script.js
   * const { Song } = require('chorus');
   * const { MidiOut } = require('chorus/midi');
   * const song = new Song(...);
   * MidiOut.select().then(midiOut => midiOut.play(song));
   *
   * ____________________________________________________
   * # command line usage
   *
   * # realtime output with the given port:
   * node chorus-script.js -p midiPortName
   *
   * # or via an environment variable:
   * CHORUS_OUTPUT_PORT=midiPortName node chorus-script.js
   *
   * # file output:
   * node chorus-script.js -f midiFileName
   */
  static select(midiOutOptions) {
    if (outputFile) {
      // Provide the same output.play(song) interface from MidiOut
      return Promise.resolve({
        play(song) {
          return new MidiFile(outputFile)
            .write(song.toJSON())
            .then(() => console.log(`Wrote MIDI file ${outputFile}`))
            .catch(err => console.error(`Failed to write MIDI file ${outputFile}`, err));
        }
      });
    }
    if (!outputPortArgOrEnvVar) usage();
    try {
      const midiOut = new (require('./midi-out'))(midiOutOptions); // using a deferred require because MidOut requires this
      return selectAndOpenOutput(midiOut, outputPortArgOrEnvVar);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        console.error('ERROR: Cannot list MIDI ports because the midi npm module is not installed.');
        console.error('You must `npm install midi` or use the -f option for file output.');
        console.error(`See the README for more info: ${pkg.repository.url}#installation`);
        process.exit(1);
      } else {
        throw err;
      }
    }
  }
}

module.exports = Output;
