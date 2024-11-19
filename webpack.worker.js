const path = require('path');

module.exports = {
  mode: 'production', // 改为生产模式
  entry: {
    qubic: './worker-bundle.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/lib'),
  },
  resolve: {
    fallback: {
      crypto: false,
      buffer: require.resolve('buffer/'),
      stream: false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'not dead']
                }
              }]
            ]
          }
        }
      }
    ]
  }
};
