/* eslint no-console: off */

const readline = require('readline');
const { basename } = require('path');
const MIDIOut = require('./midi-out');
const MIDIFile = require('./file');

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

function selectOutput(midiOutOptions) {
  if (outputFile) {
    // Provide the same output.play(song) interface from MIDIOut
    return Promise.resolve({
      play(song) {
        return new MIDIFile(outputFile)
          .write(song.toJSON())
          .then(() => console.log(`Wrote MIDI file ${outputFile}`))
          .catch(err => console.error(`Failed to write MIDI file ${outputFile}`, err));
      }
    });
  }
  if (!outputPortArgOrEnvVar) usage();
  const midiOut = new MIDIOut(midiOutOptions);
  return selectAndOpenOutput(midiOut, outputPortArgOrEnvVar);
}

module.exports = selectOutput;
