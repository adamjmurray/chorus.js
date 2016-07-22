const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const { MIDIOut } = require('../../src/midi');

function selectPort(ports) {
  return new Promise((resolve,reject) => {
    console.log(' ', ports.join('\n  '));
    readline.question('Which port? ', portSearch => {
      const substrings = portSearch.toLowerCase().split(/\s+/);
      const matches =
        ports.filter(port =>
          substrings.find(substring =>
            port.toLowerCase().includes(substring)));
      switch (matches.length) {
        case 0:
          console.log('No port found.');
          return reject();
        case 1:
          readline.close();
          return resolve(matches[0]);
        default:
          console.log('Found multiple ports:');
          return resolve(selectPort(matches));
      }
    });
  });
}

function selectOutput(output = new MIDIOut()) {
  console.log('Available MIDI output ports:');
  const outputPorts = output.ports();
  return selectPort(outputPorts)
    .then(port => output.open(port), output)
    .catch(() => selectOutput(output))
}

module.exports = selectOutput;
