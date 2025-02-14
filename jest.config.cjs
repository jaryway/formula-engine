// // const { createDefaultPreset } = require('ts-jest')
// // const { transform } = require('typescript')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  extensionsToTreatAsEsm: ['.ts'],

  transformIgnorePatterns: [
    // 'node_modules/(?!lodash-es/)'
  ]
}
