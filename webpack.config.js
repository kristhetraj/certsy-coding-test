const path = require('path');

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  watch: true,
};
