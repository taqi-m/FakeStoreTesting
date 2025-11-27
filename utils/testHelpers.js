/**
 * Test Helpers
 * Common setup, teardown, and utility functions for tests
 */

const { config } = require('../config/environment');

/**
 * Test context to store shared data across tests
 */
class TestContext {
  constructor() {
    this.createdProducts = [];
    this.testStartTime = null;
    this.testEndTime = null;
  }

  /**
   * Add created product ID for cleanup
   * @param {number} productId - Product ID to track
   */
  addCreatedProduct(productId) {
    if (productId && !this.createdProducts.includes(productId)) {
      this.createdProducts.push(productId);
    }
  }

  /**
   * Get all created product IDs
   * @returns {array} Array of product IDs
   */
  getCreatedProducts() {
    return [...this.createdProducts];
  }

  /**
   * Clear created products
   */
  clearCreatedProducts() {
    this.createdProducts = [];
  }

  /**
   * Start test timer
   */
  startTimer() {
    this.testStartTime = Date.now();
  }

  /**
   * Stop test timer and return duration
   * @returns {number} Duration in milliseconds
   */
  stopTimer() {
    this.testEndTime = Date.now();
    return this.testEndTime - this.testStartTime;
  }

  /**
   * Get test duration
   * @returns {number} Duration in milliseconds
   */
  getDuration() {
    if (this.testStartTime && this.testEndTime) {
      return this.testEndTime - this.testStartTime;
    }
    return 0;
  }
}

/**
 * Global test context instance
 */
const testContext = new TestContext();

/**
 * Setup function to run before each test suite
 * @param {string} suiteName - Name of test suite
 */
function setupTestSuite(suiteName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Starting Test Suite: ${suiteName}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Base URL: ${config.baseURL}`);
  console.log(`${'='.repeat(60)}\n`);
  
  testContext.startTimer();
}

/**
 * Teardown function to run after each test suite
 * @param {string} suiteName - Name of test suite
 */
function teardownTestSuite(suiteName) {
  const duration = testContext.stopTimer();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Completed Test Suite: ${suiteName}`);
  console.log(`Duration: ${duration}ms`);
  console.log(`Created Products: ${testContext.getCreatedProducts().length}`);
  console.log(`${'='.repeat(60)}\n`);
  
  // Note: FakeStoreAPI doesn't actually persist data,
  // so cleanup is not necessary, but we track it for real APIs
  testContext.clearCreatedProducts();
}

/**
 * Setup function to run before each test
 */
function setupTest() {
  // Can be used for test-specific setup
}

/**
 * Teardown function to run after each test
 */
function teardownTest() {
  // Can be used for test-specific cleanup
}

/**
 * Wait for specified duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after wait
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Promise that resolves with function result
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    console.log(`Retrying... (${retries} attempts remaining)`);
    await wait(delay);
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

/**
 * Log test information
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
function logTest(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    success: '✅'
  }[level] || 'ℹ️';
  
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * Create test data snapshot for debugging
 * @param {string} testName - Name of test
 * @param {object} data - Data to snapshot
 */
function createSnapshot(testName, data) {
  console.log(`\n📸 Snapshot: ${testName}`);
  console.log(JSON.stringify(data, null, 2));
  console.log('');
}

/**
 * Validate response time is acceptable
 * @param {number} startTime - Request start time
 * @param {number} maxTime - Maximum acceptable time in ms
 * @returns {boolean} Whether response time is acceptable
 */
function validateResponseTime(startTime, maxTime = 3000) {
  const duration = Date.now() - startTime;
  const isAcceptable = duration < maxTime;
  
  if (isAcceptable) {
    logTest(`Response time: ${duration}ms ✓`, 'success');
  } else {
    logTest(`Response time: ${duration}ms (exceeded ${maxTime}ms) ✗`, 'warn');
  }
  
  return isAcceptable;
}

/**
 * Generate test report summary
 * @param {object} results - Test results
 * @returns {string} Formatted report
 */
function generateTestReport(results) {
  const { passed = 0, failed = 0, total = 0, duration = 0 } = results;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;
  
  return `
╔════════════════════════════════════════╗
║         TEST EXECUTION REPORT          ║
╠════════════════════════════════════════╣
║ Total Tests:     ${String(total).padStart(20)} ║
║ Passed:          ${String(passed).padStart(20)} ║
║ Failed:          ${String(failed).padStart(20)} ║
║ Pass Rate:       ${String(passRate + '%').padStart(20)} ║
║ Duration:        ${String(duration + 'ms').padStart(20)} ║
╚════════════════════════════════════════╝
  `;
}

module.exports = {
  TestContext,
  testContext,
  setupTestSuite,
  teardownTestSuite,
  setupTest,
  teardownTest,
  wait,
  retryWithBackoff,
  logTest,
  createSnapshot,
  validateResponseTime,
  generateTestReport
};
