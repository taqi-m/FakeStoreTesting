/**
 * Schema Validator Utility
 * Provides Joi schemas for validating API responses
 */

const Joi = require('joi');

/**
 * Product Rating Schema
 */
const ratingSchema = Joi.object({
  rate: Joi.number().min(0).max(5).required(),
  count: Joi.number().integer().min(0).required()
});

/**
 * Complete Product Schema (for GET responses with rating)
 */
const productSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().required(),
  price: Joi.number().positive().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  image: Joi.string().uri().required(),
  rating: ratingSchema
});

/**
 * Product Schema without Rating (for POST/PUT responses)
 */
const productSchemaWithoutRating = Joi.object({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  image: Joi.string().uri().required()
});

/**
 * Product Creation Schema (request body)
 */
const createProductSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().positive().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  image: Joi.string().uri().required()
});

/**
 * Array of Products Schema
 */
const productsArraySchema = Joi.array().items(productSchema);

/**
 * Error Response Schema
 */
const errorSchema = Joi.object({
  message: Joi.string(),
  error: Joi.string(),
  statusCode: Joi.number()
}).unknown(true);

/**
 * Validate response against schema
 * @param {object} data - Data to validate
 * @param {object} schema - Joi schema
 * @returns {object} Validation result
 */
function validateSchema(data, schema) {
  return schema.validate(data, { abortEarly: false });
}

/**
 * Assert that data matches schema
 * @param {object} data - Data to validate
 * @param {object} schema - Joi schema
 * @throws {Error} If validation fails
 */
function assertSchema(data, schema) {
  const { error } = validateSchema(data, schema);
  if (error) {
    throw new Error(`Schema validation failed: ${error.message}`);
  }
}

module.exports = {
  schemas: {
    product: productSchema,
    productWithoutRating: productSchemaWithoutRating,
    createProduct: createProductSchema,
    productsArray: productsArraySchema,
    rating: ratingSchema,
    error: errorSchema
  },
  validateSchema,
  assertSchema
};
