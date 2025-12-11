module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['*.js', '!seed.js', '!__tests__/**'],
  testMatch: ['**/__tests__/**/*.test.js']
};
