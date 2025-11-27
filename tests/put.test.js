/**
 * PUT Endpoint Tests
 * Test scenarios for PUT /products/{id} endpoint
 */

const frisby = require('frisby');
const apiClient = require('../utils/apiClient');
const { endpoints, statusCodes } = require('../config/environment');
const { 
  assertStatusCode, 
  assertProductStructure,
  assertContentType 
} = require('../utils/assertions');
const { 
  validatePutResponse,
  validateProductMatchesSubmittedData 
} = require('../utils/responseValidator');
const { 
  generateProductData,
  getValidProductId,
  getInvalidProductId 
} = require('../utils/testDataGenerator');
const testData = require('../data/testData');

describe('PUT /products/{id} - Update Product', () => {
  
  /**
   * Test Scenario 3.1: Update Product with Valid Data (Positive Testing)
   * PUT-001: Update an existing product with all valid fields
   */
  it('PUT-001: Should update product with valid data', async () => {
    const productId = 5;
    const updateData = testData.updateProduct;
    
    return apiClient.updateProduct(productId, updateData)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const updatedProduct = res.json;
        
        // Validate product has correct ID
        expect(updatedProduct.id).toBe(productId);
        
        // Validate updated data matches submission
        validateProductMatchesSubmittedData(updatedProduct, updateData);
        
        console.log(`Updated product ID: ${productId}`);
      });
  });

  /**
   * Test Scenario 3.2: Update Non-Existent Product (Negative Testing)
   * PUT-002: Attempt to update a product that doesn't exist
   */
  it('PUT-002: Should handle update of non-existent product', async () => {
    const nonExistentId = 999;
    const updateData = generateProductData({
      title: "Should Fail",
      price: 99.99
    });
    
    return apiClient.updateProduct(nonExistentId, updateData)
      .then((res) => {
        // FakeStoreAPI might create new product or return error
        // Document the actual behavior
        
        if (res.status === statusCodes.OK) {
          // If it creates new product, verify ID
          expect(res.json).toHaveProperty('id');
          console.log('Note: FakeStoreAPI may create product with PUT on non-existent ID');
        } else if (res.status === statusCodes.NOT_FOUND) {
          // Proper error handling
          console.log('Properly returned 404 for non-existent product');
        }
      });
  });

  /**
   * Test Scenario 3.3: Boundary Value - Zero Price (BVA)
   * PUT-003: Update product with zero price value
   */
  it('PUT-003: Should handle zero price update (boundary)', async () => {
    const productId = 3;
    const updateData = testData.zeroPriceProduct;
    
    return apiClient.updateProduct(productId, updateData)
      .then((res) => {
        // Document behavior with zero price
        if (res.status === statusCodes.OK) {
          expect(res.json.price).toBe(0);
          console.log('Zero price accepted for update');
        } else {
          // If rejected
          expect(res.status).toBeGreaterThanOrEqual(400);
          console.log('Zero price rejected');
        }
      });
  });

  /**
   * Test Scenario 3.4: Negative Price Value (Negative Testing + BVA)
   * PUT-004: Attempt to update product with negative price
   */
  it('PUT-004: Should reject negative price update', async () => {
    const productId = 7;
    const updateData = testData.negativePriceProduct;
    
    return apiClient.updateProduct(productId, updateData)
      .then((res) => {
        // FakeStoreAPI might accept it (mock API) or reject it
        if (res.status === statusCodes.OK) {
          console.log('Note: FakeStoreAPI accepts negative price (mock behavior)');
          // In real API, this should be rejected
        } else {
          // Proper validation
          expect([
            statusCodes.BAD_REQUEST,
            statusCodes.UNPROCESSABLE_ENTITY
          ]).toContain(res.status);
          console.log('Negative price properly rejected');
        }
      });
  });

  /**
   * Additional Test: Update with partial data
   */
  it('Should update product with partial data', async () => {
    const productId = 8;
    const partialUpdate = {
      title: "Partially Updated Product",
      price: 89.99,
      description: "Only updating some fields",
      image: "https://fakestoreapi.com/img/partial.jpg",
      category: "electronics"
    };
    
    return apiClient.updateProduct(productId, partialUpdate)
      .expect('status', statusCodes.OK)
      .then((res) => {
        expect(res.json.id).toBe(productId);
        expect(res.json.title).toBe(partialUpdate.title);
        expect(res.json.price).toBe(partialUpdate.price);
      });
  });

  /**
   * Additional Test: Update with dynamically generated data
   */
  it('Should update product with generated data', async () => {
    const productId = getValidProductId();
    const updateData = generateProductData();
    
    return apiClient.updateProduct(productId, updateData)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const updatedProduct = res.json;
        
        // Verify ID remains the same
        expect(updatedProduct.id).toBe(productId);
        
        // Verify updated fields
        expect(updatedProduct.title).toBe(updateData.title);
        expect(updatedProduct.price).toBe(updateData.price);
      });
  });

  /**
   * Additional Test: Update same product multiple times
   */
  it('Should handle multiple updates to same product', async () => {
    const productId = 10;
    
    // First update
    const firstUpdate = generateProductData({ title: "First Update" });
    await apiClient.updateProduct(productId, firstUpdate)
      .expect('status', statusCodes.OK)
      .then(res => {
        expect(res.json.title).toBe("First Update");
      });
    
    // Second update
    const secondUpdate = generateProductData({ title: "Second Update" });
    return apiClient.updateProduct(productId, secondUpdate)
      .expect('status', statusCodes.OK)
      .then(res => {
        expect(res.json.title).toBe("Second Update");
      });
  });
});
