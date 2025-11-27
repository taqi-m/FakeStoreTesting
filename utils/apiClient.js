/**
 * API Client Utility
 * Provides reusable methods for making API requests
 */

const frisby = require('frisby');
const { config, endpoints } = require('../config/environment');

class ApiClient {
  constructor() {
    this.baseURL = config.baseURL;
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint path
   * @returns {string} Full URL
   */
  buildUrl(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options
   * @returns {object} Frisby instance
   */
  get(endpoint, options = {}) {
    return frisby
      .get(this.buildUrl(endpoint), options)
      .timeout(config.timeout);
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Additional options
   * @returns {object} Frisby instance
   */
  post(endpoint, body, options = {}) {
    return frisby
      .post(this.buildUrl(endpoint), {
        body: body,
        ...options
      })
      .timeout(config.timeout);
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Additional options
   * @returns {object} Frisby instance
   */
  put(endpoint, body, options = {}) {
    return frisby
      .put(this.buildUrl(endpoint), {
        body: body,
        ...options
      })
      .timeout(config.timeout);
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options
   * @returns {object} Frisby instance
   */
  delete(endpoint, options = {}) {
    return frisby
      .delete(this.buildUrl(endpoint), options)
      .timeout(config.timeout);
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Additional options
   * @returns {object} Frisby instance
   */
  patch(endpoint, body, options = {}) {
    return frisby
      .patch(this.buildUrl(endpoint), {
        body: body,
        ...options
      })
      .timeout(config.timeout);
  }

  // Product-specific methods
  
  /**
   * Get all products
   * @returns {object} Frisby instance
   */
  getAllProducts() {
    return this.get(endpoints.products);
  }

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {object} Frisby instance
   */
  getProductById(id) {
    return this.get(endpoints.productById(id));
  }

  /**
   * Create new product
   * @param {object} productData - Product data
   * @returns {object} Frisby instance
   */
  createProduct(productData) {
    return this.post(endpoints.products, productData);
  }

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {object} productData - Updated product data
   * @returns {object} Frisby instance
   */
  updateProduct(id, productData) {
    return this.put(endpoints.productById(id), productData);
  }

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {object} Frisby instance
   */
  deleteProduct(id) {
    return this.delete(endpoints.productById(id));
  }
}

module.exports = new ApiClient();
