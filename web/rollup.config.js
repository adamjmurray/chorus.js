const commonjs = require('@rollup/plugin-commonjs');

// module.exports = {
//   entry: './web/web-entry.js',
//   format: 'iife',
//   plugins: [commonJS()],
//   dest: './web/index.js',
//   moduleName: 'chorus',
// };

module.exports = {
  input: './web/web-entry.js',
  output: {
    file: './web/index.js',
    format: 'iife',
    name: 'chorus',
  },
  plugins: [commonjs()],
};
