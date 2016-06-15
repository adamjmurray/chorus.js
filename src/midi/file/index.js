const fs = require('fs');
const MIDIFileParser = require('./parser');
const MIDIFileSerializer = require('./serializer');

class MIDIFile {
  constructor(filepath) {
    this.filepath = filepath;
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, (error, buffer) => {
        if (error) reject(error);
        const arrayBuffer = new Uint8Array(buffer).buffer;
        const parser = new MIDIFileParser(arrayBuffer);
        resolve(parser.toJSON());
      });
    });
  }

  write(midiJSON) {
    const uint8Array = new MIDIFileSerializer(midiJSON).toUint8Array();
    var buffer = new Buffer(uint8Array);
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filepath, buffer, (error) => {
        if (error) reject(error);
        resolve();
      })
    });
  }
}

module.exports = MIDIFile;
