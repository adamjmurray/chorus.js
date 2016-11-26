const fs = require('fs');
const MidiFileParser = require('./parser');
const MidiFileSerializer = require('./serializer');

/**
 * Read and write MIDI files.
 */
class MidiFile {
  /**
   *
   * @param filepath
   */
  constructor(filepath) {
    this.filepath = filepath;
  }

  /**
   *
   * @returns {Promise}
   */
  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, (error, buffer) => {
        if (error) reject(error);
        const arrayBuffer = new Uint8Array(buffer).buffer;
        const parser = new MidiFileParser(arrayBuffer);
        resolve(parser.toJSON());
      });
    });
  }

  /**
   *
   * @param midiJSON
   * @returns {Promise}
   */
  write(midiJSON) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filepath, new MidiFileSerializer(midiJSON).toBuffer(), error => {
        if (error) reject(error);
        resolve();
      })
    });
  }
}

module.exports = MidiFile;
