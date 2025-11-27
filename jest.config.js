/**
 * Jest Configuration File
 * Configures Jest testing framework for API automation
 */

module.exports = {
  // Use node environment for API testing
  testEnvironment: 'node',
  
  // Display individual test results with test suite hierarchy
  verbose: true,
  
  // Timeout for each test (10 seconds)
  testTimeout: 10000,
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js',
    '!**/node_modules/**'
  ],
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  
  // Setup files after environment
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Test reporters
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Fake Store API - Test Report',
        outputPath: './reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        theme: 'defaultTheme',
        logo: '',
        dateFormat: 'yyyy-mm-dd HH:MM:ss'
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ]
};
