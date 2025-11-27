/**
 * DELETE Endpoint Tests
 * Test scenarios for DELETE /products/{id} endpoint
 */

const frisby = require('frisby');
const apiClient = require('../utils/apiClient');
const { endpoints, statusCodes } = require('../config/environment');
const { 
  assertStatusCode, 
  assertContentType 
} = require('../utils/assertions');
const { 
  validateDeleteResponse 
} = require('../utils/responseValidator');
const { 
  getValidProductId,
  getBoundaryProductIds,
  getInvalidProductId,
  getNonNumericProductId 
} = require('../utils/testDataGenerator');
const testData = require('../data/testData');

describe('DELETE /products/{id} - Delete Product', () => {
  
  /**
   * Test Scenario 4.1: Delete Existing Product (Positive Testing)
   * DELETE-001: Successfully delete an existing product
   */
  it('DELETE-001: Should delete existing product', async () => {
    const productId = 6;
    
    return apiClient.deleteProduct(productId)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const deletedProduct = res.json;
        
        // Validate response contains deleted product details
        expect(deletedProduct).toBeDefined();
        
        // FakeStoreAPI returns the deleted product data
        if (deletedProduct) {
          expect(deletedProduct).toHaveProperty('id');
          console.log(`Deleted product ID: ${productId}`);
        }
      });
  });

  /**
   * Test Scenario 4.2: Delete Non-Existent Product (Negative Testing)
   * DELETE-002: Attempt to delete a product that doesn't exist
   */
  it('DELETE-002: Should handle deletion of non-existent product', async () => {
    const nonExistentId = 5000;
    
    return apiClient.deleteProduct(nonExistentId)
      .then((res) => {
        // FakeStoreAPI might return 200 with null or 404
        if (res.status === statusCodes.OK) {
          // Mock API might return success even for non-existent
          console.log('Note: FakeStoreAPI returns 200 for non-existent delete');
        } else if (res.status === statusCodes.NOT_FOUND) {
          console.log('Properly returned 404 for non-existent product');
        }
        
        // Either way, ensure no crash
        expect(res.status).toBeDefined();
      });
  });

  /**
   * Test Scenario 4.3: Boundary Value - Minimum ID Deletion (BVA)
   * DELETE-003: Delete product with minimum valid ID
   */
  it('DELETE-003: Should delete product with minimum ID (boundary)', async () => {
    const boundaryIds = getBoundaryProductIds();
    
    return apiClient.deleteProduct(boundaryIds.min)
      .expect('status', statusCodes.OK)
      .then((res) => {
        const deletedProduct = res.json;
        
        // Validate deletion of first product
        expect(deletedProduct).toBeDefined();
        
        if (deletedProduct && deletedProduct.id) {
          expect(deletedProduct.id).toBe(boundaryIds.min);
        }
        
        console.log(`Deleted product with minimum ID: ${boundaryIds.min}`);
      });
  });

  /**
   * Test Scenario 4.4: Invalid ID Format (Negative Testing + Error Guessing)
   * DELETE-004: Attempt deletion with invalid ID format
   */
  it('DELETE-004: Should handle invalid ID format gracefully', async () => {
    const invalidId = 'abc';
    
    return apiClient.deleteProduct(invalidId)
      .then((res) => {
        // Should return error for invalid format
        // FakeStoreAPI might return 404 or 400
        expect([
          statusCodes.BAD_REQUEST,
          statusCodes.NOT_FOUND
        ]).toContain(res.status);
        
        console.log(`Invalid ID format handled with status: ${res.status}`);
      });
  });

  /**
   * Additional Test: Delete with maximum ID boundary
   */
  it('Should delete product with maximum ID (boundary)', async () => {
    const boundaryIds = getBoundaryProductIds();
    
    return apiClient.deleteProduct(boundaryIds.max)
      .expect('status', statusCodes.OK)
      .then((res) => {
        expect(res.json).toBeDefined();
        console.log(`Deleted product with maximum ID: ${boundaryIds.max}`);
      });
  });

  /**
   * Additional Test: Delete with zero ID
   */
  it('Should handle zero ID deletion', async () => {
    const zeroId = 0;
    
    return apiClient.deleteProduct(zeroId)
      .then((res) => {
        // Should return error for ID 0
        if (res.status === statusCodes.OK) {
          console.log('Note: FakeStoreAPI accepts zero ID');
        } else {
          expect([
            statusCodes.BAD_REQUEST,
            statusCodes.NOT_FOUND
          ]).toContain(res.status);
        }
      });
  });

  /**
   * Additional Test: Delete with negative ID
   */
  it('Should handle negative ID deletion', async () => {
    const negativeId = -1;
    
    return apiClient.deleteProduct(negativeId)
      .then((res) => {
        // Should return error for negative ID
        expect([
          statusCodes.BAD_REQUEST,
          statusCodes.NOT_FOUND
        ]).toContain(res.status);
        
        console.log('Negative ID properly rejected');
      });
  });

  /**
   * Additional Test: Delete with special characters
   */
  it('Should handle special characters in ID', async () => {
    const specialId = '!@#$';
    
    return apiClient.deleteProduct(specialId)
      .then((res) => {
        // Should return error
        expect([
          statusCodes.BAD_REQUEST,
          statusCodes.NOT_FOUND
        ]).toContain(res.status);
      });
  });

  /**
   * Additional Test: Verify idempotency of DELETE
   */
  it('Should handle multiple delete requests (idempotency)', async () => {
    const productId = 15;
    
    // First delete
    await apiClient.deleteProduct(productId)
      .expect('status', statusCodes.OK);
    
    // Second delete (same product)
    return apiClient.deleteProduct(productId)
      .then((res) => {
        // Should still return success or 404
        expect([statusCodes.OK, statusCodes.NOT_FOUND]).toContain(res.status);
        console.log('DELETE operation is idempotent');
      });
  });
});
