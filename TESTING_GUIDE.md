# Testing Guide for Jules AI

This guide explains the test structure and what Jules should expand on.

## Test Structure

All tests are located in `src/**/__tests__/` directories with `.test.js` naming convention.

```
src/
├── orders/__tests__/
│   ├── model.test.js       # Order model tests
│   └── service.test.js     # Order service tests
├── inventory/__tests__/
│   ├── model.test.js       # InventoryItem model tests
│   └── service.test.js     # Inventory service tests
├── kitchen/__tests__/
│   └── service.test.js     # Kitchen service tests
├── delivery/__tests__/
│   └── service.test.js     # Delivery service tests
└── analytics/__tests__/
    └── service.test.js     # Analytics service tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with verbose output
npm run test:verbose

# Run specific test file
npx jest src/orders/__tests__/model.test.js

# Run tests matching pattern
npx jest --testNamePattern="should create order"
```

## Test Coverage Goals

Target coverage by module:
- **Orders:** 85%+ coverage
- **Inventory:** 90%+ coverage (atomic operations critical)
- **Kitchen:** 80%+ coverage
- **Delivery:** 85%+ coverage (smart assignment logic)
- **Analytics:** 80%+ coverage

Current coverage: Use `npm run test:coverage` to check.

## What Jules Should Generate

### 1. Order Tests

**Current Status:** Basic tests with TODOs

**Jules should add:**
- Edge case tests: empty items, very large orders, zero/negative prices
- State transition tests: prevent invalid status progressions
- Concurrent order tests: race conditions with order creation
- Timestamp/audit trail tests
- Integration tests: orders → inventory → kitchen → delivery
- Performance tests: handling 1000s of orders
- Error recovery tests

**Example TODO:**
```javascript
test.todo('should handle very large orders (100+ items)');
test.todo('should prevent invalid state transitions');
test.todo('should handle concurrent status updates');
```

### 2. Inventory Tests

**Current Status:** Strong base, key gaps to fill

**Jules should add:**
- **Critical:** Concurrent reservation tests (race conditions)
- Atomic transaction verification
- Rollback on partial failures
- Negative quantity prevention
- Inventory aging reports
- Slow-moving item detection
- Multi-warehouse support (if applicable)
- Stock adjustment validation
- Restock expiry/freshness tracking

**High Priority TODOs:**
```javascript
test.todo('should handle concurrent reservations');
test.todo('should prevent negative inventory');
test.todo('should track inventory age/FIFO');
test.todo('should identify slow-moving items');
```

### 3. Kitchen Display Tests

**Current Status:** Good foundation, performance gaps

**Jules should add:**
- Priority algorithm correctness tests
- Overtime detection timing tests
- Prep time accuracy tests
- Queue reordering during prep
- High-volume kitchen tests (100+ concurrent orders)
- Staff workload balancing
- Bottleneck identification
- Kitchen SLA violation alerts
- Integration with actual prep times

**Key TODOs:**
```javascript
test.todo('should accurately track elapsed time');
test.todo('should handle 100+ concurrent orders');
test.todo('should identify kitchen bottlenecks');
test.todo('should calculate workload balance');
```

### 4. Delivery Tests

**Current Status:** Good base, edge cases needed

**Jules should add:**
- **Critical:** Smart assignment algorithm verification
- Geolocation-based assignment
- Distance calculation accuracy
- ETA prediction accuracy
- Partner performance degradation handling
- Delivery exception handling (lost, damaged, etc.)
- Multi-location delivery batching
- Peak-hour load distribution
- Partner rating calculation edge cases
- Refund/cancellation workflows

**Priority TODOs:**
```javascript
test.todo('should assign based on location proximity');
test.todo('should handle delivery exceptions');
test.todo('should balance load across peak hours');
test.todo('should recalculate partner ratings accurately');
```

### 5. Analytics Tests

**Current Status:** Core metrics covered

**Jules should add:**
- Date range edge cases
- Reporting accuracy
- Multi-day aggregation
- Trend analysis (growth calculations)
- Forecasting tests (next-day, next-week revenue)
- Anomaly detection (unusual waste, sales)
- Seasonal adjustment
- Profit margin edge cases
- CSV/PDF export tests
- Dashboard data accuracy
- Month-over-month comparisons

**Key TODOs:**
```javascript
test.todo('should calculate month-over-month growth');
test.todo('should identify sales anomalies');
test.todo('should generate accurate forecasts');
test.todo('should handle seasonal variations');
test.todo('should export reports correctly');
```

## Integration Tests

**Jules should add** comprehensive integration tests that flow through the system:

1. **Order → Inventory → Kitchen → Delivery → Analytics**
   ```javascript
   test('should track complete order lifecycle', () => {
     // Create order
     // Reserve inventory (atomic)
     // Add to kitchen queue
     // Mark ready
     // Create delivery
     // Assign partner
     // Complete delivery
     // Verify analytics updated
   });
   ```

2. **Failure Scenarios**
   - Order cancelled mid-prep
   - Inventory runs out mid-order
   - Delivery partner unavailable
   - Kitchen system failure recovery

3. **Load Tests**
   - 1000 concurrent orders
   - Peak hour scaling
   - Memory usage under load

## Performance Tests

Jules should add performance benchmarks:

```javascript
describe('Performance', () => {
  test('should create 1000 orders in < 5 seconds', () => {
    // Benchmark order creation
  });

  test('should reserve inventory atomically', () => {
    // Verify no race conditions in reservations
  });

  test('should sort kitchen queue in < 100ms', () => {
    // Kitchen display responsiveness
  });

  test('should generate analytics report in < 500ms', () => {
    // Dashboard performance
  });
});
```

## Security Tests

Jules should add security-focused tests:

```javascript
test.todo('should prevent SQL injection in queries');
test.todo('should validate all user inputs');
test.todo('should prevent negative price attacks');
test.todo('should audit sensitive operations');
test.todo('should verify permission checks');
```

## Test Patterns Jules Should Follow

### Arrange-Act-Assert (AAA)
```javascript
test('should update order status', () => {
  // Arrange
  const order = service.createOrder(...);

  // Act
  const result = service.updateOrderStatus(order.id, 'confirmed');

  // Assert
  expect(result.status).toBe('confirmed');
});
```

### Edge Cases Template
```javascript
describe('Edge Cases', () => {
  test.todo('should handle null/undefined inputs');
  test.todo('should handle zero values');
  test.todo('should handle maximum values');
  test.todo('should handle empty collections');
  test.todo('should handle concurrent access');
});
```

### Error Cases Template
```javascript
describe('Error Handling', () => {
  test('should throw error for invalid input', () => {
    expect(() => {
      service.invalidOperation();
    }).toThrow('specific error message');
  });
});
```

## Current Test Statistics

Run `npm run test:coverage` to see:
- Total test count
- Pass/fail ratio
- Coverage percentage by file
- Untested code paths

## Jules Task Configuration

Jules is configured to automatically:

1. **Generate tests** on push to `src/**/__tests__/`
2. **Run tests** as part of CI/CD
3. **Report coverage** gaps
4. **Suggest additional tests** for new code

To trigger Jules test generation:
```bash
git push origin claude/integrate-jules-4bpMY
# Jules will analyze code and create PR with comprehensive tests
```

## Test Maintenance

As new features are added:

1. **Add test.todo() placeholders** for future tests
2. **Jules will fill them in** automatically
3. **Review Jules's tests** in PR
4. **Merge** after verification

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Node.js Testing Patterns](https://nodejs.org/en/docs/guides/testing/)

## Example: What Jules Will Expand

**Current state:**
```javascript
describe('Order Creation', () => {
  test('should create order with correct properties', () => {
    // Implemented test
  });

  test.todo('should handle empty items array');
  test.todo('should handle very large orders (100+ items)');
});
```

**After Jules generates tests:**
```javascript
describe('Order Creation', () => {
  test('should create order with correct properties', () => {
    // Original test
  });

  test('should throw error for empty items array', () => {
    expect(() => {
      service.createOrder('CUST-123', 'indian', []);
    }).toThrow('Invalid order data');
  });

  test('should handle very large orders (100+ items)', () => {
    const items = Array(150).fill({ itemId: 'ITEM-1', quantity: 1, price: 100 });
    const order = service.createOrder('CUST-123', 'indian', items);
    expect(order.items.length).toBe(150);
    expect(order.totalPrice).toBe(15000);
  });

  test('should validate brand name', () => {
    expect(() => {
      service.createOrder('CUST-123', 'invalid-brand', sampleItems);
    }).toThrow('Invalid brand');
  });
});
```

---

**Next Steps:**
1. Push code to trigger Jules
2. Review Jules's generated tests
3. Merge if comprehensive
4. Repeat weekly to maintain coverage

---

Generated for Jules AI Integration  
Last updated: May 24, 2024
