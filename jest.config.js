const { pathsToModuleNameMapper } = require('ts-jest');
const paths = require('./tsconfig.json').compilerOptions.paths;

module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleDirectories: ['node_modules'],

  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  },
  transform: {
    '^.+\\.(ts|js)x?$': 'ts-jest',
  },

  preset: 'ts-jest',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
