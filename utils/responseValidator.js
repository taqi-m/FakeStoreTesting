/**
 * Response Validator Utility
 * Common validation functions for API responses
 */

const { schemas, validateSchema } = require('./schemaValidator');
const { assertStatusCode, assertContentType } = require('./assertions');

/**
 * Validate successful GET response
 * @param {object} response - Frisby response object
 * @param {boolean} validateProduct - Whether to validate product schema
 */
function validateGetResponse(response, validateProduct = true) {
  // Check status code
  assertStatusCode(response, 200);
  
  // Check content type
  assertContentType(response, 'application/json');
  
  // Validate product schema if requested
  if (validateProduct) {
    const { error } = validateSchema(response.json, schemas.product);
    if (error) {
      throw new Error(`Product schema validation failed: ${error.message}`);
    }
  }
}

/**
 * Validate successful POST response
 * @param {object} response - Frisby response object
 */
function validatePostResponse(response) {
  // Check status code (can be 200 or 201)
  const validStatuses = [200, 201];
  expect(validStatuses).toContain(response.status);
  
  // Check content type
  assertContentType(response, 'application/json');
  
  // Validate product created
  expect(response.json).toHaveProperty('id');
  expect(typeof response.json.id).toBe('number');
}

/**
 * Validate successful PUT response
 * @param {object} response - Frisby response object
 */
function validatePutResponse(response) {
  // Check status code
  assertStatusCode(response, 200);
  
  // Check content type
  assertContentType(response, 'application/json');
  
  // Validate response has id
  expect(response.json).toHaveProperty('id');
}

/**
 * Validate successful DELETE response
 * @param {object} response - Frisby response object
 */
function validateDeleteResponse(response) {
  // Check status code
  assertStatusCode(response, 200);
  
  // Check content type
  assertContentType(response, 'application/json');
}

/**
 * Validate error response (4xx, 5xx)
 * @param {object} response - Frisby response object
 * @param {number} expectedStatus - Expected error status code
 */
function validateErrorResponse(response, expectedStatus) {
  // Check status code
  assertStatusCode(response, expectedStatus);
  
  // Note: FakeStoreAPI might return null or empty response for some errors
  // So we just verify the status code
}

/**
 * Validate response headers
 * @param {object} response - Frisby response object
 * @param {object} expectedHeaders - Expected headers
 */
function validateHeaders(response, expectedHeaders = {}) {
  Object.keys(expectedHeaders).forEach(headerName => {
    const headerValue = response.headers.get(headerName.toLowerCase());
    expect(headerValue).toBeTruthy();
    if (expectedHeaders[headerName]) {
      expect(headerValue).toContain(expectedHeaders[headerName]);
    }
  });
}

/**
 * Validate product fields match submitted data
 * @param {object} responseProduct - Product from response
 * @param {object} submittedData - Original submitted data
 */
function validateProductMatchesSubmittedData(responseProduct, submittedData) {
  Object.keys(submittedData).forEach(key => {
    expect(responseProduct[key]).toBe(submittedData[key]);
  });
}

/**
 * Validate array response
 * @param {object} response - Frisby response object
 * @param {number} minLength - Minimum expected array length
 */
function validateArrayResponse(response, minLength = 1) {
  assertStatusCode(response, 200);
  expect(Array.isArray(response.json)).toBe(true);
  expect(response.json.length).toBeGreaterThanOrEqual(minLength);
}

module.exports = {
  validateGetResponse,
  validatePostResponse,
  validatePutResponse,
  validateDeleteResponse,
  validateErrorResponse,
  validateHeaders,
  validateProductMatchesSubmittedData,
  validateArrayResponse
};
