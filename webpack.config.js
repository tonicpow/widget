// Common configuration
let config = {
  entry: './src/index.ts',
  mode: 'production',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  stats: {
    errorDetails: true,
  },
}

// Build a version for widgets (deprecated)
let widgetJs = Object.assign({}, config, {
  output: {
    filename: 'widget.js',
    publicPath: '',
  },
})

// Build a version for tonicpow.js (new)
let tonicpowJs = Object.assign({}, config, {
  output: {
    filename: 'tonicpow.js',
    publicPath: '',
  },
})

// Return array of configurations
module.exports = [widgetJs, tonicpowJs]
