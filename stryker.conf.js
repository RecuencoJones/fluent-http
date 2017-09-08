module.exports = (config) => {
  config.set({
    files: [
      {
        pattern: 'src/**/*.js',
        mutated: true,
        included: false
      },
      'test/**/*.js'
    ],
    testRunner: 'jest',
    reporter: [
      'html',
      'clear-text',
      'progress'
    ],
    htmlReporter: {
      baseDir: 'coverage/mutation'
    },
    coverageAnalysis: 'all'
  })
}
