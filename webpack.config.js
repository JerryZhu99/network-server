var path = require('path');

module.exports = {
  entry: {
    'game':'game/game.js',
    'app':'app/main.js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname + '/src'),
    ]
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'files'),
    libraryTarget: "var",
    library: "[name]"
  },
  devtool: 'source-map'

};