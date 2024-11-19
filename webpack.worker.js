const path = require('path');

module.exports = {
  mode: 'development',
  entry: './worker-bundle.js',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: false,
      buffer: require.resolve('buffer/'),
      stream: false
    }
  },
  optimization: {
    minimize: false
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
