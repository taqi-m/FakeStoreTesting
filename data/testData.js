/**
 * Test Data - Product Payloads
 * Predefined test data for product testing
 */

module.exports = {
  // Valid product data
  validProduct: {
    title: "Premium Wireless Headphones",
    price: 299.99,
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://fakestoreapi.com/img/headphones.jpg",
    category: "electronics"
  },

  // Product with minimum price (boundary value)
  minPriceProduct: {
    title: "Test Product - Minimum Price",
    price: 0.01,
    description: "Testing minimum price boundary value",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product with zero price (boundary value)
  zeroPriceProduct: {
    title: "Free Product",
    price: 0,
    description: "Testing zero price boundary",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product with negative price (invalid)
  negativePriceProduct: {
    title: "Invalid Price Product",
    price: -50.00,
    description: "Testing negative price validation",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product with missing title (invalid)
  missingTitleProduct: {
    price: 99.99,
    description: "Missing title field",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product with invalid price type (invalid)
  invalidPriceType: {
    title: "Test Product",
    price: "invalid_price",
    description: "Testing data type validation",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product update data
  updateProduct: {
    title: "Updated Product Name",
    price: 159.99,
    description: "Updated product description with new features",
    image: "https://fakestoreapi.com/img/updated.jpg",
    category: "electronics"
  },

  // Product with very long title (boundary value)
  longTitleProduct: {
    title: "A".repeat(500),
    price: 99.99,
    description: "Testing long title boundary",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product with empty title (invalid)
  emptyTitleProduct: {
    title: "",
    price: 99.99,
    description: "Testing empty title validation",
    image: "https://fakestoreapi.com/img/test.jpg",
    category: "electronics"
  },

  // Product categories
  categories: [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing"
  ],

  // Valid product IDs for testing
  validProductIds: {
    min: 1,
    max: 20,
    middle: 10
  },

  // Invalid product IDs for testing
  invalidProductIds: {
    outOfRange: 9999,
    negative: -1,
    zero: 0,
    nonNumeric: "abc",
    special: "!@#$"
  }
};
