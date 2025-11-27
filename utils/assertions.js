/**
 * Assertion Helpers
 * Reusable assertion functions for API testing
 */

const { statusCodes } = require('../config/environment');

/**
 * Assert status code
 * @param {object} response - Frisby response object
 * @param {number} expectedStatus - Expected status code
 */
function assertStatusCode(response, expectedStatus) {
  expect(response.status).toBe(expectedStatus);
}

/**
 * Assert response has required fields
 * @param {object} responseBody - Response body object
 * @param {array} requiredFields - Array of required field names
 */
function assertRequiredFields(responseBody, requiredFields) {
  requiredFields.forEach(field => {
    expect(responseBody).toHaveProperty(field);
    expect(responseBody[field]).toBeDefined();
  });
}

/**
 * Assert response field type
 * @param {object} responseBody - Response body object
 * @param {string} field - Field name
 * @param {string} expectedType - Expected type (string, number, object, array)
 */
function assertFieldType(responseBody, field, expectedType) {
  expect(responseBody).toHaveProperty(field);
  expect(typeof responseBody[field]).toBe(expectedType);
}

/**
 * Assert product structure
 * @param {object} product - Product object
 * @param {boolean} includeRating - Whether to check for rating field
 */
function assertProductStructure(product, includeRating = true) {
  const requiredFields = ['id', 'title', 'price', 'description', 'category', 'image'];
  if (includeRating) {
    requiredFields.push('rating');
  }
  
  assertRequiredFields(product, requiredFields);
  
  // Assert types
  expect(typeof product.id).toBe('number');
  expect(typeof product.title).toBe('string');
  expect(typeof product.price).toBe('number');
  expect(typeof product.description).toBe('string');
  expect(typeof product.category).toBe('string');
  expect(typeof product.image).toBe('string');
  
  if (includeRating) {
    expect(typeof product.rating).toBe('object');
    expect(product.rating).toHaveProperty('rate');
    expect(product.rating).toHaveProperty('count');
  }
}

/**
 * Assert product data matches expected
 * @param {object} actual - Actual product object
 * @param {object} expected - Expected product data
 */
function assertProductData(actual, expected) {
  Object.keys(expected).forEach(key => {
    expect(actual[key]).toBe(expected[key]);
  });
}

/**
 * Assert response time is acceptable
 * @param {object} response - Frisby response object
 * @param {number} maxTime - Maximum acceptable time in ms
 */
function assertResponseTime(response, maxTime = 3000) {
  const responseTime = response._fetchRes.elapsedTime || 0;
  expect(responseTime).toBeLessThan(maxTime);
}

/**
 * Assert array contains items
 * @param {array} arr - Array to check
 * @param {number} minLength - Minimum expected length
 */
function assertArrayNotEmpty(arr, minLength = 1) {
  expect(Array.isArray(arr)).toBe(true);
  expect(arr.length).toBeGreaterThanOrEqual(minLength);
}

/**
 * Assert content type header
 * @param {object} response - Frisby response object
 * @param {string} expectedType - Expected content type
 */
function assertContentType(response, expectedType = 'application/json') {
  const contentType = response.headers.get('content-type');
  expect(contentType).toContain(expectedType);
}

/**
 * Assert error response structure
 * @param {object} responseBody - Response body
 */
function assertErrorResponse(responseBody) {
  // FakeStoreAPI might return different error formats
  // This is flexible to handle various formats
  const hasErrorField = responseBody.hasOwnProperty('error') || 
                        responseBody.hasOwnProperty('message') ||
                        responseBody.hasOwnProperty('statusCode');
  
  expect(hasErrorField).toBe(true);
}

/**
 * Assert numeric value is within range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 */
function assertInRange(value, min, max) {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}

/**
 * Assert string is not empty
 * @param {string} str - String to check
 */
function assertStringNotEmpty(str) {
  expect(typeof str).toBe('string');
  expect(str.length).toBeGreaterThan(0);
  expect(str.trim()).not.toBe('');
}

module.exports = {
  assertStatusCode,
  assertRequiredFields,
  assertFieldType,
  assertProductStructure,
  assertProductData,
  assertResponseTime,
  assertArrayNotEmpty,
  assertContentType,
  assertErrorResponse,
  assertInRange,
  assertStringNotEmpty
};
