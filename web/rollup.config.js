const commonJS = require('rollup-plugin-commonjs');

module.exports = {
  entry: './web/web-entry.js',
  format: 'iife',
  plugins: [ commonJS() ],
  dest: './web/index.js',
  moduleName: 'chorus',
};
