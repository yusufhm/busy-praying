module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/test/unit/**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: ['store/**/*.js', 'plugins/**/*.js'],
  coverageReporters: ['text', 'lcov'],
}
