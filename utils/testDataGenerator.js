/**
 * Test Data Generator
 * Generates test data for API testing
 */

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random number within range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} decimals - Number of decimal places
 * @returns {number} Random number
 */
function generateRandomNumber(min = 0, max = 1000, decimals = 2) {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
}

/**
 * Generate random product data
 * @param {object} overrides - Fields to override
 * @returns {object} Product data
 */
function generateProductData(overrides = {}) {
  const categories = ['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing'];
  
  return {
    title: overrides.title || `Test Product ${generateRandomString(5)}`,
    price: overrides.price !== undefined ? overrides.price : generateRandomNumber(1, 999, 2),
    description: overrides.description || `Test product description ${generateRandomString(20)}`,
    image: overrides.image || 'https://fakestoreapi.com/img/test.jpg',
    category: overrides.category || categories[Math.floor(Math.random() * categories.length)],
    ...overrides
  };
}

/**
 * Generate product with minimum price (boundary value)
 * @returns {object} Product data with minimum price
 */
function generateMinPriceProduct() {
  return generateProductData({ price: 0.01 });
}

/**
 * Generate product with zero price (boundary value)
 * @returns {object} Product data with zero price
 */
function generateZeroPriceProduct() {
  return generateProductData({ price: 0 });
}

/**
 * Generate product with negative price (invalid)
 * @returns {object} Product data with negative price
 */
function generateNegativePriceProduct() {
  return generateProductData({ price: -50.00 });
}

/**
 * Generate product with missing required field
 * @param {string} fieldToRemove - Field name to remove
 * @returns {object} Incomplete product data
 */
function generateIncompleteProduct(fieldToRemove = 'title') {
  const product = generateProductData();
  delete product[fieldToRemove];
  return product;
}

/**
 * Generate product with invalid data type
 * @param {string} field - Field name
 * @param {any} invalidValue - Invalid value
 * @returns {object} Product with invalid data
 */
function generateInvalidTypeProduct(field = 'price', invalidValue = 'invalid_price') {
  return generateProductData({ [field]: invalidValue });
}

/**
 * Generate product with very long string (boundary value)
 * @param {string} field - Field to make long
 * @returns {object} Product with long string
 */
function generateLongStringProduct(field = 'title') {
  return generateProductData({ [field]: generateRandomString(1000) });
}

/**
 * Generate product with empty string (invalid)
 * @param {string} field - Field to make empty
 * @returns {object} Product with empty field
 */
function generateEmptyStringProduct(field = 'title') {
  return generateProductData({ [field]: '' });
}

/**
 * Get valid product ID (within range 1-20)
 * @returns {number} Valid product ID
 */
function getValidProductId() {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Get boundary product IDs
 * @returns {object} Min and max product IDs
 */
function getBoundaryProductIds() {
  return {
    min: 1,
    max: 20
  };
}

/**
 * Get invalid product ID (out of range)
 * @returns {number} Invalid product ID
 */
function getInvalidProductId() {
  return Math.floor(Math.random() * 9000) + 1000;
}

/**
 * Get non-numeric product ID
 * @returns {string} Non-numeric ID
 */
function getNonNumericProductId() {
  return generateRandomString(5);
}

/**
 * Generate batch of products
 * @param {number} count - Number of products to generate
 * @returns {array} Array of product objects
 */
function generateProductBatch(count = 5) {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push(generateProductData());
  }
  return products;
}

module.exports = {
  generateRandomString,
  generateRandomNumber,
  generateProductData,
  generateMinPriceProduct,
  generateZeroPriceProduct,
  generateNegativePriceProduct,
  generateIncompleteProduct,
  generateInvalidTypeProduct,
  generateLongStringProduct,
  generateEmptyStringProduct,
  getValidProductId,
  getBoundaryProductIds,
  getInvalidProductId,
  getNonNumericProductId,
  generateProductBatch
};
