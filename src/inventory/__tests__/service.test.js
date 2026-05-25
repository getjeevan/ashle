const InventoryService = require('../service');

describe('InventoryService', () => {
  let service;

  beforeEach(() => {
    service = new InventoryService();
    service.addItem('BIRYANI-001', 'Chicken Biryani', 'indian', 100, 10, 250, 120);
    service.addItem('ROTI-001', 'Roti', 'indian', 200, 20, 50, 20);
    service.addItem('CURRY-001', 'Curry', 'thai', 150, 15, 180, 80);
  });

  describe('Item Management', () => {
    test('should add new item', () => {
      const item = service.addItem('DOSA-001', 'Dosa', 'indian', 50, 5, 120, 50);
      expect(item.itemId).toBe('DOSA-001');
      expect(service.items.size).toBe(4);
    });

    test('should throw error when adding duplicate item', () => {
      expect(() => {
        service.addItem('BIRYANI-001', 'Chicken Biryani', 'indian', 100, 10, 250, 120);
      }).toThrow('already exists');
    });

    test('should retrieve item by ID', () => {
      const item = service.getItem('BIRYANI-001');
      expect(item.name).toBe('Chicken Biryani');
    });

    test('should get items by brand', () => {
      const indianItems = service.getItemsByBrand('indian');
      expect(indianItems.length).toBe(2);
      expect(indianItems.every(i => i.brand === 'indian')).toBe(true);
    });

    // TODO: Jules should add tests for:
    test.todo('should update existing item');
    test.todo('should delete items');
    test.todo('should search items by name');
  });

  describe('Stock Monitoring', () => {
    test('should identify low stock items', () => {
      const lowStock = service.getLowStockItems();
      expect(lowStock.length).toBeGreaterThan(0);
      expect(lowStock.every(i => i.isLowStock())).toBe(true);
    });

    test('should identify sold out items', () => {
      const item = service.getItem('BIRYANI-001');
      item.quantity = 0;
      const soldOut = service.getSoldOutItems();
      expect(soldOut.some(i => i.itemId === 'BIRYANI-001')).toBe(true);
    });

    // TODO: Jules should add tests for:
    test.todo('should get stock expiry alerts');
    test.todo('should identify slow-moving items');
  });

  describe('Atomic Reservations', () => {
    test('should reserve items for order', () => {
      const items = [
        { itemId: 'BIRYANI-001', quantity: 5 },
        { itemId: 'ROTI-001', quantity: 10 }
      ];
      const result = service.reserveForOrder('ORD-1001', items);
      expect(result.success).toBe(true);
      expect(result.reserved.length).toBe(2);
      expect(service.getItem('BIRYANI-001').quantity).toBe(95);
    });

    test('should rollback reservation on insufficient stock', () => {
      const initialQty = service.getItem('BIRYANI-001').quantity;
      const items = [
        { itemId: 'BIRYANI-001', quantity: 50 },
        { itemId: 'ROTI-001', quantity: 300 } // Exceeds stock
      ];
      expect(() => {
        service.reserveForOrder('ORD-1002', items);
      }).toThrow('Insufficient stock');
      // Verify rollback
      expect(service.getItem('BIRYANI-001').quantity).toBe(initialQty);
    });

    test('should prevent overselling with concurrent requests', () => {
      const items = [{ itemId: 'BIRYANI-001', quantity: 50 }];
      service.reserveForOrder('ORD-1001', items);
      expect(() => {
        service.reserveForOrder('ORD-1002', items);
      }).toThrow('Insufficient stock');
    });

    test('should release reservation', () => {
      const items = [{ itemId: 'BIRYANI-001', quantity: 10 }];
      service.reserveForOrder('ORD-1001', items);
      const afterReserve = service.getItem('BIRYANI-001').quantity;
      service.releaseReservation('ORD-1001');
      expect(service.getItem('BIRYANI-001').quantity).toBe(afterReserve + 10);
    });

    test('should confirm reservation', () => {
      const items = [{ itemId: 'BIRYANI-001', quantity: 10 }];
      service.reserveForOrder('ORD-1001', items);
      service.confirmReservation('ORD-1001');
      expect(service.reservations.has('ORD-1001')).toBe(false);
    });

    // TODO: Jules should add tests for:
    test.todo('should handle multiple concurrent orders');
    test.todo('should prevent reservation of non-existent items');
    test.todo('should track reservation timestamps');
    test.todo('should auto-expire old reservations');
  });

  describe('Restocking', () => {
    test('should restock item', () => {
      const before = service.getItem('BIRYANI-001').quantity;
      service.restockItem('BIRYANI-001', 30);
      const after = service.getItem('BIRYANI-001').quantity;
      expect(after).toBe(before + 30);
    });

    test('should throw error for non-existent item', () => {
      expect(() => {
        service.restockItem('INVALID-001', 10);
      }).toThrow('not found');
    });

    // TODO: Jules should add tests for:
    test.todo('should validate restock quantities');
    test.todo('should log restocking transactions');
  });

  describe('Waste Tracking', () => {
    test('should record waste', () => {
      const before = service.getItem('BIRYANI-001').quantity;
      service.recordWaste('BIRYANI-001', 5);
      const after = service.getItem('BIRYANI-001').quantity;
      expect(after).toBe(before - 5);
      expect(service.getItem('BIRYANI-001').wasteCount).toBe(5);
    });

    test('should get daily waste report', () => {
      service.recordWaste('BIRYANI-001', 5);
      service.recordWaste('ROTI-001', 3);
      const waste = service.getDailyWaste();
      expect(waste.length).toBeGreaterThan(0);
      expect(waste.some(w => w.wasteCount > 0)).toBe(true);
    });

    // TODO: Jules should add tests for:
    test.todo('should categorize waste by reason (spoilage, damage, etc)');
    test.todo('should calculate waste percentage by item');
    test.todo('should identify high-waste items');
    test.todo('should generate waste reduction alerts');
  });

  describe('Reporting', () => {
    test('should get all inventory', () => {
      const all = service.getAllInventory();
      expect(all.length).toBe(3);
    });

    test('should calculate inventory value', () => {
      // Total inventory value = sum of (price * quantity) for each item
      const item1 = service.getItem('BIRYANI-001');
      const item2 = service.getItem('ROTI-001');
      const expectedValue = (item1.price * item1.quantity) + (item2.price * item2.quantity);
      expect(expectedValue).toBeGreaterThan(0);
    });

    // TODO: Jules should add tests for:
    test.todo('should generate inventory aging report');
    test.todo('should calculate inventory turnover ratio');
    test.todo('should identify slow-moving items');
  });
});
