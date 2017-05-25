const assert = require('assert');
const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const chorusStub = require('./chorus-stub');

function runExample(path) {
  proxyquire(path, chorusStub);
}

function getLastPlayedSongJSON() {
  return chorusStub.getLastPlayedSong().toJSON();
}

describe('examples', () => {

  for (const exampleFile of fs.readdirSync(`${__dirname}/../../examples`)) {
    if (exampleFile.match(/^\d\d-.*\.js/)) {
      const exampleName = path.basename(exampleFile, path.extname(exampleFile));

      describe(`examples/${exampleFile}`, () => {
        it('generates the expected MIDI JSON', () => {
          runExample(`../../examples/${exampleFile}`);
          const actual = getLastPlayedSongJSON();
          let expected;
          try {
            expected = require(`./${exampleName}-expected.json`);
          } catch (err) {
            // console.log('\nERROR: Missing example expected.json file');
            // console.log(`Confirm examples/${exampleFile} is behaving correctly.`);
            // console.log(`If so, add the file test/examples/${exampleName}-expected.json:\n`);
            // console.log(JSON.stringify(actual, null, 2));
            // console.log('\n');
            return;
          }
          assert.deepEqual(actual, expected);
        });
      });
    }
  }
});
