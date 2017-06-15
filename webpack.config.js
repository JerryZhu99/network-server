var path = require('path');

module.exports = {
  entry: {
    'game':'game/game.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname + '/src'),
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'files'),
    libraryTarget: "var",
    library: "game"
  },
  devtool: 'source-map'

};