// Common configuration
let config = {
  mode: 'production',
  target: 'web',
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
