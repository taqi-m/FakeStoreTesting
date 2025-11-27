/**
 * Jest Setup File
 * Global configuration and setup for all tests
 */

const frisby = require('frisby');
const { config } = require('./environment');

// Set global timeout
jest.setTimeout(config.timeout);

// Global before all tests
beforeAll(() => {
  console.log('\n🚀 Starting API Test Suite');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Base URL: ${config.baseURL}\n`);
});

// Global after all tests
afterAll(() => {
  console.log('\n✅ API Test Suite Completed\n');
});

// Configure Frisby global settings
frisby.globalSetup({
  request: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: config.timeout
  }
});
