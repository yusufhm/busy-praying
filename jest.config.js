module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    // Stub Nuxt auto-imports so tests don't need a running Nuxt instance
    '^#app$': '<rootDir>/test/__mocks__/nuxt-app.js',
    '^#imports$': '<rootDir>/test/__mocks__/nuxt-imports.js',
  },
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/test/unit/**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'stores/**/*.js',
    'plugins/**/*.js',
    'integrations/**/*.js',
    'composables/**/*.js',
  ],
  coverageReporters: ['text', 'lcov'],
}
