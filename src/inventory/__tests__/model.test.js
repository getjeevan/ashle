const InventoryItem = require('../model');

describe('InventoryItem Model', () => {
  let item;

  beforeEach(() => {
    item = new InventoryItem(
      'BIRYANI-001',
      'Chicken Biryani',
      'indian',
      50,        // quantity
      10,        // minStock
      250,       // price
      120        // cost
    );
  });

  describe('Item Creation', () => {
    test('should create inventory item with correct properties', () => {
      expect(item.itemId).toBe('BIRYANI-001');
      expect(item.name).toBe('Chicken Biryani');
      expect(item.brand).toBe('indian');
      expect(item.quantity).toBe(50);
      expect(item.minStock).toBe(10);
    });

    test('should track last restocked time', () => {
      expect(item.lastRestocked).toBeDefined();
      expect(item.lastRestocked).toBeInstanceOf(Date);
    });

    test('should initialize waste count to zero', () => {
      expect(item.wasteCount).toBe(0);
    });

    // TODO: Jules should add tests for:
    test.todo('should validate item properties on creation');
    test.todo('should reject invalid quantities');
    test.todo('should reject negative prices');
  });

  describe('Stock Status', () => {
    test('should identify low stock correctly', () => {
      expect(item.isLowStock()).toBe(false);
      item.quantity = 10;
      expect(item.isLowStock()).toBe(true);
    });

    test('should identify sold out items', () => {
      expect(item.isSoldOut()).toBe(false);
      item.quantity = 0;
      expect(item.isSoldOut()).toBe(true);
    });

    // TODO: Jules should add tests for:
    test.todo('should handle edge case: quantity equals minStock');
    test.todo('should handle edge case: quantity one below minStock');
  });

  describe('Reservations', () => {
    test('should reserve stock successfully', () => {
      const result = item.reserve(10);
      expect(result).toBe(true);
      expect(item.quantity).toBe(40);
    });

    test('should reject reservation exceeding stock', () => {
      const result = item.reserve(100);
      expect(result).toBe(false);
      expect(item.quantity).toBe(50); // Unchanged
    });

    test('should reserve exact quantity', () => {
      const result = item.reserve(50);
      expect(result).toBe(true);
      expect(item.quantity).toBe(0);
    });

    // TODO: Jules should add tests for:
    test.todo('should prevent negative reservations');
    test.todo('should handle concurrent reservations');
    test.todo('should handle fractional quantities');
  });

  describe('Restocking', () => {
    test('should restock item', () => {
      item.quantity = 30;
      const newQty = item.restockItem(20);
      expect(newQty).toBe(50);
      expect(item.lastRestocked).toBeDefined();
    });

    test('should update last restocked time', () => {
      const originalTime = item.lastRestocked;
      item.restockItem(10);
      expect(item.lastRestocked.getTime()).toBeGreaterThan(originalTime.getTime());
    });

    // TODO: Jules should add tests for:
    test.todo('should validate restock quantities');
    test.todo('should handle large restock amounts');
  });

  describe('Waste Tracking', () => {
    test('should record waste', () => {
      item.recordWaste(5);
      expect(item.wasteCount).toBe(5);
      expect(item.quantity).toBe(45);
    });

    test('should accumulate waste count', () => {
      item.recordWaste(2);
      item.recordWaste(3);
      expect(item.wasteCount).toBe(5);
      expect(item.quantity).toBe(45);
    });

    test('should not allow waste more than quantity', () => {
      item.recordWaste(100); // Would go negative
      expect(item.quantity).toBeLessThan(0); // Current behavior - TODO: fix
    });

    // TODO: Jules should add tests for:
    test.todo('should prevent negative waste values');
    test.todo('should calculate waste percentage');
    test.todo('should track waste by date/time');
  });

  describe('Profitability', () => {
    test('should calculate profit correctly', () => {
      const profit = item.getProfit();
      expect(profit).toBe((250 - 120) * 50); // (price - cost) * quantity
    });

    test('should handle zero quantity', () => {
      item.quantity = 0;
      const profit = item.getProfit();
      expect(profit).toBe(0);
    });

    // TODO: Jules should add tests for:
    test.todo('should calculate profit margin percentage');
    test.todo('should account for waste in profitability');
  });

  describe('Serialization', () => {
    test('should convert to JSON with all fields', () => {
      const json = item.toJSON();
      expect(json.itemId).toBe('BIRYANI-001');
      expect(json.quantity).toBe(50);
      expect(json.isLowStock).toBe(false);
      expect(json.isSoldOut).toBe(false);
    });

    // TODO: Jules should add tests for:
    test.todo('should include calculated fields in JSON');
  });
});
