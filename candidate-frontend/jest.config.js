module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jest.text-encoding-polyfill.js'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js)$': 'jest-preset-angular',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'css', 'json'],
  moduleNameMapper: {
    '\\.(html|css)$': '<rootDir>/jest.file-mock.js'
  },
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  collectCoverage: true,
  coverageReporters: ['html', 'text'],
};
