var path = require('path');

var config = {
    entry: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/js/index.js'),
    ],
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'index.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query:
            {
                presets:['es2015', 'react']
            }
        }]
    },

};

module.exports = config;
