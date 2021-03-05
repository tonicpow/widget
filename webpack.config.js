// Common configuration
let config = {
  devtool: 'inline-source-map', // TODO: Turn this off for prod
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
    errorDetails: true
  }
}

// Build a version for widgets (deprecated)
let widgetJs = Object.assign({}, config, {
  output: {
    filename: 'widget.js',
  },
})

// Build a version for tonicpow.js (new)
let tonicpowJs = Object.assign({}, config, {
  output: {
    filename: 'tonicpow.js',
  },
})

// Return array of configurations
module.exports = [widgetJs, tonicpowJs]
