const parse = require('./src/lang/parse');
const argv = process.argv;
const midifile = require('./src/file');
const readMIDIFile = midifile.readMIDIFile;

if (argv[2] === 'parse') {
  console.log(parse(process.argv[3]));
}
else if (argv[2] === 'read') {
  readMIDIFile(argv[3])
    .then(midiJSON => console.log(JSON.stringify(midiJSON, null, 2)));
}
