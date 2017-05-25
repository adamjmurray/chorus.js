/* eslint-env browser */
module.exports = {

  appendBytesToPage(byteArray) {
    document.body.appendChild(
      document.createTextNode(
        Array.from(byteArray).map(
          b => b.toString(16).toUpperCase()
        ).join(' ')
      )
    );
  },

  createDownloader() {
    const a = document.createElement('a');
    a.style = 'display: none';
    document.body.appendChild(a);
    return {
      download(byteArray, name) {
        const blob = new Blob([byteArray], {type: 'octet/stream'});
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    };
  }
};
