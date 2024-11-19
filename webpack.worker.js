const path = require('path');

module.exports = {
  mode: 'production',
  entry: './worker-bundle.js',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'public'),
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
