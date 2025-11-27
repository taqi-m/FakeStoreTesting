/**
 * GET Endpoint Tests - Complete Implementation
 * Test scenarios for GET /products/{id} endpoint
 * 
 * Implements all test scenarios from Phase 1:
 * - GET-001: Valid Product Retrieval (Positive Testing)
 * - GET-002: Boundary Value - Minimum Product ID (BVA)
 * - GET-003: Boundary Value - Maximum Product ID (BVA)
 * - GET-004: Invalid Product ID - Out of Range (Negative Testing)
 * 
 * Additional comprehensive tests included
 */

const frisby = require('frisby');
const apiClient = require('../utils/apiClient');
const { endpoints, statusCodes, validProductRange } = require('../config/environment');
const { 
  assertStatusCode, 
  assertProductStructure,
  assertContentType,
  assertRequiredFields,
  assertFieldType,
  assertInRange,
  assertStringNotEmpty,
  assertArrayNotEmpty
} = require('../utils/assertions');
const { 
  validateGetResponse,
  validateErrorResponse,
  validateArrayResponse 
} = require('../utils/responseValidator');
const { 
  getValidProductId,
  getBoundaryProductIds,
  getInvalidProductId 
} = require('../utils/testDataGenerator');
const { 
  setupTestSuite, 
  teardownTestSuite,
  logTest,
  createSnapshot,
  testContext 
} = require('../utils/testHelpers');
const { schemas, validateSchema } = require('../utils/schemaValidator');
const testData = require('../data/testData');

describe('GET /products/{id} - Retrieve Single Product', () => {
  
  // Setup before all tests
  beforeAll(() => {
    setupTestSuite('GET Endpoint Tests');
  });

  // Teardown after all tests
  afterAll(() => {
    teardownTestSuite('GET Endpoint Tests');
  });
  
  /**
   * Test Scenario 1.1: Valid Product Retrieval (Positive Testing)
   * GET-001: Retrieve an existing product with a valid ID
   * 
   * Test Design Technique: Positive Testing
   * Expected Result: 200 OK with complete product data
   */
  it('GET-001: Should retrieve product with valid ID and validate complete structure', async () => {
    const productId = 1;
    logTest(`Testing GET with product ID: ${productId}`, 'info');
    
    return apiClient.getProductById(productId)
      .expect('status', statusCodes.OK)
      .expect('header', 'content-type', /json/)
      .then((res) => {
        const product = res.json;
        
        logTest('Validating product structure', 'info');
        
        // Validate product structure
        assertProductStructure(product, true);
        
        // Validate ID matches
        expect(product.id).toBe(productId);
        
        // Validate all required fields are present
        const requiredFields = ['id', 'title', 'price', 'description', 'category', 'image', 'rating'];
        assertRequiredFields(product, requiredFields);
        
        // Validate data types
        assertFieldType(product, 'id', 'number');
        assertFieldType(product, 'title', 'string');
        assertFieldType(product, 'price', 'number');
        assertFieldType(product, 'description', 'string');
        assertFieldType(product, 'category', 'string');
        assertFieldType(product, 'image', 'string');
        assertFieldType(product, 'rating', 'object');
        
        // Validate price is positive
        expect(product.price).toBeGreaterThan(0);
        
        // Validate strings are not empty
        assertStringNotEmpty(product.title);
        assertStringNotEmpty(product.description);
        assertStringNotEmpty(product.category);
        assertStringNotEmpty(product.image);
        
        // Validate rating object
        expect(product.rating).toHaveProperty('rate');
        expect(product.rating).toHaveProperty('count');
        assertInRange(product.rating.rate, 0, 5);
        expect(product.rating.count).toBeGreaterThanOrEqual(0);
        
        // Validate against Joi schema
        const { error } = validateSchema(product, schemas.product);
        expect(error).toBeUndefined();
        
        logTest('Product retrieved and validated successfully', 'success');
        createSnapshot('GET-001 Response', product);
      });
  });

  /**
   * Test Scenario 1.2: Boundary Value - Minimum Product ID (BVA)
   * GET-002: Test with the minimum valid product ID
   * 
   * Test Design Technique: Boundary Value Analysis
   * Expected Result: 200 OK with product data for ID 1
   */
  it('GET-002: Should retrieve product with minimum ID (boundary value)', async () => {
    const boundaryIds = getBoundaryProductIds();
    const minId = boundaryIds.min;
    
    logTest(`Testing boundary value - Minimum ID: ${minId}`, 'info');
    
    return apiClient.getProductById(minId)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const product = res.json;
        
        // Validate product exists
        expect(product).toBeDefined();
        expect(product).not.toBeNull();
        expect(product.id).toBe(minId);
        
        // Validate product structure
        assertProductStructure(product, true);
        
        // Validate this is indeed the minimum ID product
        expect(product.id).toBe(validProductRange.min);
        
        logTest(`Successfully retrieved product at minimum boundary (ID: ${minId})`, 'success');
      });
  });

  /**
   * Test Scenario 1.3: Boundary Value - Maximum Product ID (BVA)
   * GET-003: Test with the maximum valid product ID
   * 
   * Test Design Technique: Boundary Value Analysis
   * Expected Result: 200 OK with product data for ID 20
   */
  it('GET-003: Should retrieve product with maximum ID (boundary value)', async () => {
    const boundaryIds = getBoundaryProductIds();
    const maxId = boundaryIds.max;
    
    logTest(`Testing boundary value - Maximum ID: ${maxId}`, 'info');
    
    return apiClient.getProductById(maxId)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const product = res.json;
        
        // Validate product exists
        expect(product).toBeDefined();
        expect(product).not.toBeNull();
        expect(product.id).toBe(maxId);
        
        // Validate product structure
        assertProductStructure(product, true);
        
        // Validate this is indeed the maximum ID product
        expect(product.id).toBe(validProductRange.max);
        
        logTest(`Successfully retrieved product at maximum boundary (ID: ${maxId})`, 'success');
      });
  });

  /**
   * Test Scenario 1.4: Invalid Product ID - Out of Range (Negative Testing)
   * GET-004: Attempt to retrieve product with non-existent ID
   * 
   * Test Design Technique: Negative Testing + BVA
   * Expected Result: 404 Not Found OR null response
   */
  it('GET-004: Should handle non-existent product ID gracefully (negative test)', async () => {
    const invalidId = getInvalidProductId();
    
    logTest(`Testing with invalid product ID: ${invalidId}`, 'info');
    
    return apiClient.getProductById(invalidId)
      .then((res) => {
        // FakeStoreAPI returns null for non-existent products
        // Status might still be 200 with null body, or 404
        if (res.status === statusCodes.OK) {
          expect(res.json).toBeNull();
          logTest('API returned 200 with null for non-existent product', 'info');
        } else {
          expect(res.status).toBe(statusCodes.NOT_FOUND);
          logTest('API returned 404 for non-existent product', 'success');
        }
        
        // Ensure no server crash or unexpected error
        expect(res.status).toBeLessThan(500);
      });
  });

  /**
   * Additional Test: Get all products
   * Validates array response and structure
   */
  it('Should retrieve all products with valid structure', async () => {
    logTest('Testing GET all products', 'info');
    
    return apiClient.getAllProducts()
      .expect('status', statusCodes.OK)
      .then((res) => {
        const products = res.json;
        
        // Validate array
        expect(Array.isArray(products)).toBe(true);
        assertArrayNotEmpty(products, 1);
        
        // Validate we get expected number of products
        expect(products.length).toBeGreaterThanOrEqual(20);
        
        // Validate first product structure
        if (products.length > 0) {
          assertProductStructure(products[0], true);
          
          // Validate all products have required fields
          products.forEach((product, index) => {
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('title');
            expect(product).toHaveProperty('price');
          });
        }
        
        logTest(`Retrieved ${products.length} products successfully`, 'success');
      });
  });

  /**
   * Additional Test: Content-Type header validation
   */
  it('Should return correct Content-Type header', async () => {
    const productId = getValidProductId();
    
    return apiClient.getProductById(productId)
      .expect('status', statusCodes.OK)
      .then((res) => {
        assertContentType(res, 'application/json');
        logTest('Content-Type header validated successfully', 'success');
      });
  });

  /**
   * Additional Test: Data-driven test with multiple IDs
   * Parameterized testing approach
   */
  describe('Data-Driven: Multiple Product IDs', () => {
    const testIds = [1, 5, 10, 15, 20];
    
    testIds.forEach(productId => {
      it(`Should retrieve product with ID ${productId}`, async () => {
        return apiClient.getProductById(productId)
          .expect('status', statusCodes.OK)
          .then((res) => {
            expect(res.json.id).toBe(productId);
            assertProductStructure(res.json, true);
          });
      });
    });
  });

  /**
   * Additional Test: Validate specific categories
   */
  it('Should retrieve products with valid categories', async () => {
    const validCategories = testData.categories;
    
    return apiClient.getAllProducts()
      .expect('status', statusCodes.OK)
      .then((res) => {
        const products = res.json;
        
        // Check that all products have valid categories
        products.forEach(product => {
          expect(validCategories).toContain(product.category);
        });
        
        logTest('All product categories are valid', 'success');
      });
  });

  /**
   * Additional Test: Validate price ranges
   */
  it('Should have products with valid price ranges', async () => {
    return apiClient.getAllProducts()
      .expect('status', statusCodes.OK)
      .then((res) => {
        const products = res.json;
        
        products.forEach(product => {
          expect(product.price).toBeGreaterThan(0);
          expect(product.price).toBeLessThan(10000); // Reasonable upper limit
        });
        
        logTest('All product prices are within valid range', 'success');
      });
  });

  /**
   * Additional Test: Response time validation
   */
  it('Should respond within acceptable time limits', async () => {
    const startTime = Date.now();
    const productId = getValidProductId();
    
    return apiClient.getProductById(productId)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const responseTime = Date.now() - startTime;
        
        // Response should be under 3 seconds
        expect(responseTime).toBeLessThan(3000);
        
        logTest(`Response time: ${responseTime}ms`, 'success');
        expect(res.json).toBeDefined();
      });
  });
});
