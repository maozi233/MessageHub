const path = require('path');

module.exports = {
  mode: 'production',
  entry: "./src/index.ts",
  module: {
    rules: [{ test: /\.tsx?$/, use: 'ts-loader'}],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib/hub'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
  }
};