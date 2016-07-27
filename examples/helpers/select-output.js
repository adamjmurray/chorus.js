const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const { basename } = require('path');
const { MIDIOut } = require('../../src/midi');

let outputPortArg;
for (let i=2; i<process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '-p') outputPortArg = process.argv[++i];
}

function usage() {
  console.log(`
Usage: node node_modules/chorus/examples/${basename(process.argv[1])} -p [outputPort]

No MIDI output specified.\n`);
}

function findPortMatches(ports, substrings) {
  const matches =
    ports.filter(port =>
      substrings.find(substring =>
        port.toLowerCase().includes(substring)));
  return matches;
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
    readline.question('Which port? ', portSearch => {
      findPort(ports, portSearch)
        .then(resolve)
        .catch(matches => (matches ? resolve(selectPort(matches)) : reject()));
    });
  });
}

function selectAndOpenOutput(midiOut, portSearch) {
  const ports = midiOut.ports();
  if (!portSearch) console.log('MIDI output ports:');
  return (portSearch ? findPort(ports, portSearch) : selectPort(ports))
    .then(port => {
      readline.close();
      midiOut.open(port);
      return midiOut
    })
    .catch(() => selectOutput(midiOut));
}

module.exports = function selectOutput(midiOutOptions) {
  if (!outputPortArg) usage();
  const midiOut = new MIDIOut(midiOutOptions);
  return selectAndOpenOutput(midiOut, outputPortArg);
};
