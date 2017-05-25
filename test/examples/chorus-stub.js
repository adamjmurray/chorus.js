const chorus = require('../../index');
chorus['@global'] = true;
chorus['@noCallThru'] = true;

const names = require('../../names');
names['@global'] = true;
names['@noCallThru'] = true;

let lastPlayedSong;

chorus.Output = {
  select() {
    return {
      then(onOutputSelected) {
        onOutputSelected({
          play(song) {
            lastPlayedSong = song;
          }
        })
      }
    }
  }
};

module.exports = {
  chorus,
  'chorus/names': names,
  getLastPlayedSong() {
    return lastPlayedSong;
  },
};
