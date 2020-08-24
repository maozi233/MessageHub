const path = require('path');

module.exports = {
  mode: 'production',
  entry: "src/index.ts",
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exlude: /node_modules/}],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this',
    umoNamedDefined: true,
    path: path.resolve(__dirname, 'lib/hub-umd'),
  },
  reolve: {
    extensions: ['.js', '.ts'],
  }
};