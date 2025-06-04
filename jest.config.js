module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/apps'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@alpha-agents/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@alpha-agents/core/(.*)$': '<rootDir>/packages/core/src/$1',
    '^@alpha-agents/agents/(.*)$': '<rootDir>/packages/agents/src/$1',
    '^@alpha-agents/services/(.*)$': '<rootDir>/packages/services/src/$1',
  },
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!packages/**/*.d.ts',
    '!packages/**/index.ts',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};