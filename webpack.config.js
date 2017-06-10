var path = require('path');

module.exports = {
  entry: './src/game.js',
  resolve: {
    modules: [
      path.resolve(__dirname + '/src'),
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'files')
  },
  devtool: 'source-map'

};