const path = require('path');

module.exports = {
  mode: 'production',
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader']
      }
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/umd'),
    globalObject: 'this', // 兼容node环境下的window问题
    libraryTarget:'umd',
    library: '__hub__', // 兼容 script引入
    // umdNamedDefine: true, // 如果 output.libraryTarget 设置为umd 而且output.library 也设置了。这个设为true，将为AMD模块命名。
  },
  resolve: {
    extensions: ['.js', '.ts'],
  }
};