# Fake Store API - Automated Testing Framework
## Jest + Frisby API Test Automation

![Node.js](https://img.shields.io/badge/Node.js-v16%2B-green)
![Jest](https://img.shields.io/badge/Jest-v29.7.0-red)
![Frisby](https://img.shields.io/badge/Frisby-v2.1.3-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Complete API testing framework for Fake Store API with modular architecture, reusable utilities, and comprehensive test coverage.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Framework Components](#framework-components)
- [Test Scenarios](#test-scenarios)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is a professional-grade API testing framework built for the **Fake Store API** using **Jest** and **Frisby**. The framework implements industry best practices including:

- **Modular Architecture**: Separation of concerns with dedicated modules
- **DRY Principle**: Reusable utilities and helpers
- **Configurable Environments**: Easy switching between environments
- **Comprehensive Coverage**: 16+ test scenarios covering CRUD operations
- **Assertion Helpers**: Standardized validation functions
- **Test Data Management**: Centralized test data with generators

**API Under Test:** [https://fakestoreapi.com](https://fakestoreapi.com)

---

## ✨ Features

### Core Capabilities
- ✅ **Complete CRUD Testing**: GET, POST, PUT, DELETE endpoints
- ✅ **Test Design Techniques**: BVA, EP, Error Guessing, Positive/Negative Testing
- ✅ **Schema Validation**: Joi-based response validation
- ✅ **Reusable Utilities**: API client, assertions, validators
- ✅ **Dynamic Test Data**: Test data generators
- ✅ **Environment Configuration**: Multi-environment support
- ✅ **Detailed Reporting**: Verbose test output
- ✅ **Coverage Reporting**: Jest coverage reports

### Framework Highlights
- 🔧 Modular design for easy maintenance
- 🎨 Clean, readable test syntax
- 🚀 Fast execution with parallel testing
- 📊 Comprehensive assertion library
- 🔄 Reusable components across tests
- 📝 Well-documented codebase

---

## 📁 Project Structure

```
api-tests/
├── config/                      # Configuration files
│   ├── environment.js          # Environment settings (URLs, endpoints, status codes)
│   └── jest.setup.js           # Jest global setup and Frisby configuration
│
├── data/                       # Test data management
│   └── testData.js            # Predefined test data and payloads
│
├── tests/                      # Test files (organized by HTTP method)
│   ├── get.test.js            # GET endpoint tests
│   ├── post.test.js           # POST endpoint tests
│   ├── put.test.js            # PUT endpoint tests
│   └── delete.test.js         # DELETE endpoint tests
│
├── utils/                      # Utility modules
│   ├── apiClient.js           # API client with HTTP methods
│   ├── assertions.js          # Custom assertion helpers
│   ├── responseValidator.js   # Response validation utilities
│   ├── schemaValidator.js     # Joi schema validators
│   └── testDataGenerator.js  # Dynamic test data generators
│
├── .env.example               # Environment variables template
├── jest.config.js             # Jest configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

---

## 🔧 Prerequisites

Before running the tests, ensure you have:

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Git**: For cloning the repository (optional)
- **Internet Connection**: To access Fake Store API

### Check Versions
```powershell
node --version   # Should be v16.x or higher
npm --version    # Should be v8.x or higher
```

---

## 📦 Installation

### Step 1: Navigate to Project Directory
```powershell
cd "{rootDir}\api-tests"
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install:
- **jest** - Testing framework
- **frisby** - API testing library
- **joi** - Schema validation
- **dotenv** - Environment variable management

### Step 3: Verify Installation
```powershell
npm list --depth=0
```

You should see all dependencies listed without errors.

---

## ⚙️ Configuration

### Environment Setup

1. **Copy environment template:**
   ```powershell
   copy .env.example .env
   ```

2. **Edit `.env` file** (optional):
   ```env
   NODE_ENV=development
   API_BASE_URL=https://fakestoreapi.com
   API_TIMEOUT=10000
   TEST_TIMEOUT=10000
   ```

### Configuration Files

#### `config/environment.js`
- Base URL configuration
- API endpoints
- Status codes
- Environment-specific settings

#### `jest.config.js`
- Test timeout
- Coverage settings
- Test file patterns
- Environment setup

#### `config/jest.setup.js`
- Global test setup
- Frisby global configuration
- Before/After hooks

---

## 🚀 Running Tests

### Run All Tests
```powershell
npm test
```

### Run Specific Test Suite
```powershell
# GET endpoint tests only
npm run test:get

# POST endpoint tests only
npm run test:post

# PUT endpoint tests only
npm run test:put

# DELETE endpoint tests only
npm run test:delete
```

### Run Tests with Coverage
```powershell
npm run test:coverage
```

### Run Tests in Watch Mode
```powershell
npm run test:watch
```

### Run Tests with Verbose Output
```powershell
npm run test:verbose
```

### Run Tests Sequentially
```powershell
npm run test:all
```

---

## 🧩 Framework Components

### 1. API Client (`utils/apiClient.js`)

Centralized HTTP client for making API requests.

```javascript
const apiClient = require('./utils/apiClient');

// GET request
apiClient.getProductById(1);

// POST request
apiClient.createProduct(productData);

// PUT request
apiClient.updateProduct(5, updateData);

// DELETE request
apiClient.deleteProduct(6);
```

**Features:**
- Automatic URL construction
- Timeout management
- Reusable HTTP methods
- Product-specific methods

### 2. Assertions (`utils/assertions.js`)

Reusable assertion functions for common validations.

```javascript
const { assertProductStructure, assertStatusCode } = require('./utils/assertions');

// Assert product has required fields
assertProductStructure(product, true);

// Assert status code
assertStatusCode(response, 200);
```

**Available Assertions:**
- `assertStatusCode()` - Validate HTTP status
- `assertProductStructure()` - Validate product schema
- `assertRequiredFields()` - Check required fields
- `assertFieldType()` - Validate field types
- `assertContentType()` - Check content type header
- And more...

### 3. Schema Validator (`utils/schemaValidator.js`)

Joi-based schema validation for API responses.

```javascript
const { schemas, assertSchema } = require('./utils/schemaValidator');

// Validate product schema
assertSchema(product, schemas.product);
```

**Available Schemas:**
- `product` - Complete product with rating
- `productWithoutRating` - Product without rating
- `createProduct` - Product creation payload
- `productsArray` - Array of products

### 4. Test Data Generator (`utils/testDataGenerator.js`)

Dynamic test data generation functions.

```javascript
const { generateProductData, getValidProductId } = require('./utils/testDataGenerator');

// Generate random product
const product = generateProductData();

// Generate specific test cases
const minPrice = generateMinPriceProduct();
const invalid = generateInvalidTypeProduct();
```

**Available Generators:**
- `generateProductData()` - Random valid product
- `generateMinPriceProduct()` - Boundary value
- `generateInvalidTypeProduct()` - Invalid data
- `getValidProductId()` - Random valid ID
- And more...

### 5. Response Validator (`utils/responseValidator.js`)

High-level response validation functions.

```javascript
const { validateGetResponse } = require('./utils/responseValidator');

// Validate complete GET response
validateGetResponse(response);
```

### 6. Test Data (`data/testData.js`)

Predefined test data for consistent testing.

```javascript
const testData = require('./data/testData');

// Use predefined product
apiClient.createProduct(testData.validProduct);
```

---

## 📝 Test Scenarios

### GET Endpoint Tests (`tests/get.test.js`)

| Test ID | Description | Technique |
|---------|-------------|-----------|
| GET-001 | Retrieve product with valid ID | Positive Testing |
| GET-002 | Minimum product ID (boundary) | BVA |
| GET-003 | Maximum product ID (boundary) | BVA |
| GET-004 | Non-existent product ID | Negative Testing |

### POST Endpoint Tests (`tests/post.test.js`)

| Test ID | Description | Technique |
|---------|-------------|-----------|
| POST-001 | Create product with valid data | Positive Testing |
| POST-002 | Create with minimum price | BVA |
| POST-003 | Missing required field | Negative Testing, EP |
| POST-004 | Invalid data type | Error Guessing, EP |

### PUT Endpoint Tests (`tests/put.test.js`)

| Test ID | Description | Technique |
|---------|-------------|-----------|
| PUT-001 | Update with valid data | Positive Testing |
| PUT-002 | Update non-existent product | Negative Testing |
| PUT-003 | Zero price (boundary) | BVA |
| PUT-004 | Negative price | Negative Testing, BVA |

### DELETE Endpoint Tests (`tests/delete.test.js`)

| Test ID | Description | Technique |
|---------|-------------|-----------|
| DELETE-001 | Delete existing product | Positive Testing |
| DELETE-002 | Delete non-existent product | Negative Testing |
| DELETE-003 | Minimum ID (boundary) | BVA |
| DELETE-004 | Invalid ID format | Error Guessing, EP |

---

## 🎯 Best Practices

### 1. Writing Tests

✅ **DO:**
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Use utility functions from `utils/`
- Keep tests independent
- Document test scenarios

❌ **DON'T:**
- Hardcode URLs or endpoints
- Duplicate assertion logic
- Create interdependent tests
- Ignore error cases

### 2. Using Utilities

```javascript
// ✅ GOOD: Use utility functions
const product = generateProductData();
apiClient.createProduct(product);

// ❌ BAD: Hardcode data
apiClient.post('/products', { title: 'test', price: 10 });
```

### 3. Assertions

```javascript
// ✅ GOOD: Use assertion helpers
assertProductStructure(product);

// ❌ BAD: Manual assertions
expect(product).toHaveProperty('id');
expect(product).toHaveProperty('title');
// ... repeated code
```

### 4. Test Data

```javascript
// ✅ GOOD: Use test data module
const product = testData.validProduct;

// ❌ BAD: Inline test data
const product = { title: 'test', price: 99 };
```

---

## 📊 Coverage Reports

Generate coverage reports:

```powershell
npm run test:coverage
```

View coverage in:
- `coverage/lcov-report/index.html` (HTML report)
- `coverage/coverage-final.json` (JSON report)

Coverage thresholds are set in `jest.config.js`:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors
```powershell
# Solution: Reinstall dependencies
rm -r node_modules
npm install
```

#### 2. Tests timeout
```powershell
# Solution: Increase timeout in jest.config.js
testTimeout: 15000  # Increase from 10000
```

#### 3. Network errors
- Check internet connection
- Verify Fake Store API is accessible: https://fakestoreapi.com
- Check firewall settings

#### 4. PowerShell script execution
```powershell
# If npm scripts fail, run directly:
node_modules\.bin\jest
```

---

## 📚 Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Frisby.js Documentation](https://docs.frisbyjs.com/)
- [Joi Documentation](https://joi.dev/api/)
- [Fake Store API Docs](https://fakestoreapi.com/docs)

### Test Design Techniques
- **Boundary Value Analysis (BVA)**: Testing edge cases
- **Equivalence Partitioning (EP)**: Grouping similar inputs
- **Error Guessing**: Predicting common errors
- **Positive Testing**: Valid input scenarios
- **Negative Testing**: Invalid input scenarios

---

## 🤝 Contributing

### Adding New Tests

1. Create test file in `tests/` directory
2. Import required utilities
3. Follow existing test structure
4. Document test scenarios
5. Update this README

### Adding New Utilities

1. Create utility file in `utils/` directory
2. Export reusable functions
3. Add JSDoc comments
4. Update test files to use new utilities

---

## 👤 Author

**taqi-m**  


---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review test output for error details
3. Consult framework documentation
4. Check API status: https://fakestoreapi.com

---

## 🎓 Learning Outcomes

By using this framework, you will learn:

- ✅ API testing with Jest and Frisby
- ✅ Modular test framework architecture
- ✅ Test design techniques (BVA, EP, Error Guessing)
- ✅ Schema validation with Joi
- ✅ Reusable test utilities
- ✅ Test data management
- ✅ Environment configuration
- ✅ Coverage reporting

---

**Happy Testing! 🚀**

*Last Updated: November 27, 2025*
