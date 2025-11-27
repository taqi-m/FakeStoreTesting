/**
 * POST Endpoint Tests - Complete Implementation
 * Test scenarios for POST /products endpoint
 * 
 * Implements all test scenarios from Phase 1:
 * - POST-001: Create Product with Valid Data (Positive Testing)
 * - POST-002: Boundary Value - Minimum Price (BVA)
 * - POST-003: Missing Required Field (Negative Testing)
 * - POST-004: Invalid Data Type (Negative Testing + Error Guessing)
 * 
 * Additional comprehensive tests included
 */

const frisby = require('frisby');
const apiClient = require('../utils/apiClient');
const { endpoints, statusCodes } = require('../config/environment');
const { 
  assertStatusCode, 
  assertProductStructure,
  assertContentType,
  assertRequiredFields 
} = require('../utils/assertions');
const { 
  validatePostResponse,
  validateProductMatchesSubmittedData 
} = require('../utils/responseValidator');
const { 
  generateProductData,
  generateMinPriceProduct,
  generateIncompleteProduct,
  generateInvalidTypeProduct,
  generateZeroPriceProduct,
  generateNegativePriceProduct,
  generateLongStringProduct,
  generateEmptyStringProduct
} = require('../utils/testDataGenerator');
const {
  setupTestSuite,
  teardownTestSuite,
  logTest,
  createSnapshot,
  testContext
} = require('../utils/testHelpers');
const testData = require('../data/testData');

describe('POST /products - Create New Product', () => {
  
  // Setup before all tests
  beforeAll(() => {
    setupTestSuite('POST Endpoint Tests');
  });

  // Teardown after all tests
  afterAll(() => {
    teardownTestSuite('POST Endpoint Tests');
  });
  
  /**
   * Test Scenario 2.1: Create Product with Valid Data (Positive Testing)
   * POST-001: Create a new product with all required fields and valid data
   * 
   * Test Design Technique: Positive Testing
   * Expected Result: 200/201 with new product ID
   */
  it('POST-001: Should create product with all valid data', async () => {
    const productData = testData.validProduct;
    
    logTest('Testing POST with valid product data', 'info');
    createSnapshot('POST-001 Request', productData);
    
    return apiClient.createProduct(productData)
      .then((res) => {
        // Validate status code (200 or 201)
        expect([statusCodes.OK, statusCodes.CREATED]).toContain(res.status);
        
        const createdProduct = res.json;
        
        // Validate product has ID
        expect(createdProduct).toHaveProperty('id');
        expect(typeof createdProduct.id).toBe('number');
        expect(createdProduct.id).toBeGreaterThan(0);
        
        // Validate submitted data matches response
        validateProductMatchesSubmittedData(createdProduct, productData);
        
        // Validate all required fields are present
        assertRequiredFields(createdProduct, ['id', 'title', 'price', 'description', 'image', 'category']);
        
        // Track created product for potential cleanup
        testContext.addCreatedProduct(createdProduct.id);
        
        logTest(`Product created successfully with ID: ${createdProduct.id}`, 'success');
        createSnapshot('POST-001 Response', createdProduct);
      });
  });

  /**
   * Test Scenario 2.2: Boundary Value - Minimum Price (BVA)
   * POST-002: Create product with minimum valid price value
   * 
   * Test Design Technique: Boundary Value Analysis
   * Expected Result: 200/201 with price 0.01
   */
  it('POST-002: Should create product with minimum price (boundary value)', async () => {
    const productData = testData.minPriceProduct;
    
    logTest(`Testing POST with minimum price: ${productData.price}`, 'info');
    
    return apiClient.createProduct(productData)
      .then((res) => {
        expect([statusCodes.OK, statusCodes.CREATED]).toContain(res.status);
        
        const createdProduct = res.json;
        
        // Validate price is correctly stored
        expect(createdProduct.price).toBe(0.01);
        expect(createdProduct).toHaveProperty('id');
        
        // Validate no rounding errors
        expect(createdProduct.price.toFixed(2)).toBe('0.01');
        
        testContext.addCreatedProduct(createdProduct.id);
        logTest('Minimum price boundary value accepted successfully', 'success');
      });
  });

  /**
   * Test Scenario 2.3: Missing Required Field (Negative Testing)
   * POST-003: Attempt to create product without required field
   * 
   * Test Design Technique: Negative Testing + Equivalence Partitioning
   * Expected Result: 400/422 error OR acceptance (mock API behavior)
   */
  it('POST-003: Should handle missing required field appropriately', async () => {
    const incompleteProduct = testData.missingTitleProduct;
    
    logTest('Testing POST with missing title field', 'info');
    createSnapshot('POST-003 Request (Missing Title)', incompleteProduct);
    
    return apiClient.createProduct(incompleteProduct)
      .then((res) => {
        // FakeStoreAPI might still accept it (returns 200) as it's a mock API
        // In real API, this should return 400 or 422
        
        if (res.status === statusCodes.OK || res.status === statusCodes.CREATED) {
          // Mock API accepts it, but we document this behavior
          logTest('Note: FakeStoreAPI accepts incomplete data (mock behavior)', 'warn');
          expect(res.json).toHaveProperty('id');
        } else {
          // If it properly validates, expect error
          expect([
            statusCodes.BAD_REQUEST, 
            statusCodes.UNPROCESSABLE_ENTITY
          ]).toContain(res.status);
          logTest('Validation error returned as expected', 'success');
        }
      });
  });

  /**
   * Test Scenario 2.4: Invalid Data Type (Negative Testing + Error Guessing)
   * POST-004: Submit product with string value for numeric price field
   * 
   * Test Design Technique: Error Guessing + Equivalence Partitioning
   * Expected Result: 400/422 error OR type conversion
   */
  it('POST-004: Should handle invalid price data type appropriately', async () => {
    const invalidProduct = testData.invalidPriceType;
    
    logTest('Testing POST with invalid price data type', 'info');
    createSnapshot('POST-004 Request (Invalid Type)', invalidProduct);
    
    return apiClient.createProduct(invalidProduct)
      .then((res) => {
        // FakeStoreAPI might convert string to number or accept it
        
        if (res.status === statusCodes.OK || res.status === statusCodes.CREATED) {
          logTest('Note: FakeStoreAPI may handle type conversion', 'warn');
          expect(res.json).toHaveProperty('id');
        } else {
          // If it properly validates, expect error
          expect([
            statusCodes.BAD_REQUEST, 
            statusCodes.UNPROCESSABLE_ENTITY
          ]).toContain(res.status);
          logTest('Type validation error returned as expected', 'success');
        }
      });
  });

  /**
   * Additional Test: Create product with generated data
   */
  it('Should create product with dynamically generated data', async () => {
    const productData = generateProductData();
    
    logTest('Testing with dynamically generated product', 'info');
    
    return apiClient.createProduct(productData)
      .then((res) => {
        expect([statusCodes.OK, statusCodes.CREATED]).toContain(res.status);
        
        const createdProduct = res.json;
        expect(createdProduct).toHaveProperty('id');
        
        // Validate all fields are present
        expect(createdProduct.title).toBe(productData.title);
        expect(createdProduct.price).toBe(productData.price);
        expect(createdProduct.category).toBe(productData.category);
        
        testContext.addCreatedProduct(createdProduct.id);
        logTest('Dynamically generated product created successfully', 'success');
      });
  });

  /**
   * Additional Test: Zero price boundary value
   */
  it('Should handle zero price product creation (boundary value)', async () => {
    const productData = testData.zeroPriceProduct;
    
    logTest('Testing zero price boundary', 'info');
    
    return apiClient.createProduct(productData)
      .then((res) => {
        // Document behavior with zero price
        if (res.status === statusCodes.OK || res.status === statusCodes.CREATED) {
          expect(res.json.price).toBe(0);
          logTest('Zero price accepted', 'info');
        } else {
          // If rejected, should be client error
          expect(res.status).toBeGreaterThanOrEqual(400);
          logTest('Zero price rejected', 'info');
        }
      });
  });

  /**
   * Additional Test: Negative price (should be rejected)
   */
  it('Should handle negative price validation', async () => {
    const productData = generateNegativePriceProduct();
    
    logTest('Testing negative price handling', 'info');
    
    return apiClient.createProduct(productData)
      .then((res) => {
        if (res.status === statusCodes.OK || res.status === statusCodes.CREATED) {
          logTest('Note: FakeStoreAPI accepts negative price (mock behavior)', 'warn');
        } else {
          expect(res.status).toBeGreaterThanOrEqual(400);
          logTest('Negative price rejected appropriately', 'success');
        }
      });
  });

  /**
   * Additional Test: Empty string validation
   */
  it('Should handle empty title string', async () => {
    const productData = generateEmptyStringProduct('title');
    
    logTest('Testing empty title validation', 'info');
    
    return apiClient.createProduct(productData)
      .then((res) => {
        // Should either accept or reject consistently
        if (res.status === statusCodes.OK || res.status === statusCodes.CREATED) {
          logTest('Empty title accepted (documenting behavior)', 'warn');
        } else {
          expect([statusCodes.BAD_REQUEST, statusCodes.UNPROCESSABLE_ENTITY]).toContain(res.status);
          logTest('Empty title rejected', 'success');
        }
      });
  });

  /**
   * Data-Driven Test: Create multiple products with different categories
   */
  describe('Data-Driven: Multiple Product Categories', () => {
    const categories = testData.categories;
    
    categories.forEach(category => {
      it(`Should create product in category: ${category}`, async () => {
        const productData = generateProductData({ category });
        
        return apiClient.createProduct(productData)
          .then((res) => {
            expect([statusCodes.OK, statusCodes.CREATED]).toContain(res.status);
            expect(res.json.category).toBe(category);
            testContext.addCreatedProduct(res.json.id);
          });
      });
    });
  });

  /**
   * Data-Driven Test: Create products with various price points
   */
  describe('Data-Driven: Price Ranges', () => {
    const pricePoints = [
      { value: 0.01, description: 'minimum' },
      { value: 9.99, description: 'single digit' },
      { value: 99.99, description: 'double digit' },
      { value: 999.99, description: 'triple digit' }
    ];
    
    pricePoints.forEach(({ value, description }) => {
      it(`Should create product with ${description} price (${value})`, async () => {
        const productData = generateProductData({ price: value });
        
        return apiClient.createProduct(productData)
          .then((res) => {
            expect([statusCodes.OK, statusCodes.CREATED]).toContain(res.status);
            expect(res.json.price).toBe(value);
          });
      });
    });
  });

  /**
   * Additional Test: Create multiple products sequentially
   */
  it('Should create multiple products successfully', async () => {
    const products = [
      generateProductData({ category: 'electronics' }),
      generateProductData({ category: 'jewelery' }),
      generateProductData({ category: "men's clothing" })
    ];
    
    logTest('Creating multiple products sequentially', 'info');
    
    const promises = products.map(product => 
      apiClient.createProduct(product).then(res => res.json)
    );
    
    return Promise.all(promises).then(createdProducts => {
      expect(createdProducts.length).toBe(3);
      createdProducts.forEach(product => {
        expect(product).toHaveProperty('id');
        testContext.addCreatedProduct(product.id);
      });
      
      logTest(`Created ${createdProducts.length} products successfully`, 'success');
    });
  });

  /**
   * Additional Test: Content-Type header validation
   */
  it('Should accept and return JSON content type', async () => {
    const productData = generateProductData();
    
    return apiClient.createProduct(productData)
      .then((res) => {
        assertContentType(res, 'application/json');
        logTest('Content-Type validation passed', 'success');
      });
  });

  /**
   * Additional Test: Long string handling
   */
  it('Should handle long product title', async () => {
    const productData = generateLongStringProduct('title');
    
    logTest('Testing long title handling', 'info');
    
    return apiClient.createProduct(productData)
      .then((res) => {
        // Document behavior with long strings
        if (res.status === statusCodes.OK || res.status === statusCodes.CREATED) {
          expect(res.json).toHaveProperty('id');
          logTest('Long title accepted', 'info');
        } else {
          logTest('Long title rejected', 'info');
        }
      });
  });
});
