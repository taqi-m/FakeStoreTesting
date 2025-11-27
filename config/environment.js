/**
 * Environment Configuration
 * Manages environment-specific settings for API testing
 */

require('dotenv').config();

const environments = {
  development: {
    baseURL: 'https://fakestoreapi.com',
    timeout: 10000,
    retryAttempts: 3,
    logLevel: 'debug'
  },
  test: {
    baseURL: 'https://fakestoreapi.com',
    timeout: 10000,
    retryAttempts: 3,
    logLevel: 'debug'
  },
  staging: {
    baseURL: 'https://fakestoreapi.com',
    timeout: 8000,
    retryAttempts: 2,
    logLevel: 'info'
  },
  production: {
    baseURL: 'https://fakestoreapi.com',
    timeout: 5000,
    retryAttempts: 1,
    logLevel: 'error'
  }
};

// Get current environment from ENV variable or default to development
const currentEnv = process.env.NODE_ENV || 'development';

// Export environment configuration
module.exports = {
  env: currentEnv,
  config: environments[currentEnv],
  
  // API Endpoints
  endpoints: {
    products: '/products',
    productById: (id) => `/products/${id}`,
    carts: '/carts',
    users: '/users',
    auth: '/auth/login'
  },
  
  // Valid product ID range
  validProductRange: {
    min: 1,
    max: 20
  },
  
  // HTTP Status Codes
  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // Default headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
