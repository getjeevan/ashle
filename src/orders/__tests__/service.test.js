const OrderService = require('../service');

describe('OrderService', () => {
  let service;
  let sampleItems;

  beforeEach(() => {
    service = new OrderService();
    sampleItems = [
      { itemId: 'BIRYANI-001', quantity: 2, price: 250 },
      { itemId: 'ROTI-001', quantity: 3, price: 50 }
    ];
  });

  describe('Order Creation', () => {
    test('should create order with unique ID', () => {
      const order = service.createOrder('CUST-123', 'indian', sampleItems);
      expect(order.id).toMatch(/^ORD-\d+$/);
      expect(order.status).toBe('pending');
    });

    test('should create multiple orders with different IDs', () => {
      const order1 = service.createOrder('CUST-123', 'indian', sampleItems);
      const order2 = service.createOrder('CUST-124', 'thai', sampleItems);
      expect(order1.id).not.toBe(order2.id);
    });

    test('should throw error for missing customerId', () => {
      expect(() => {
        service.createOrder(null, 'indian', sampleItems);
      }).toThrow('Invalid order data');
    });

    test('should throw error for empty items array', () => {
      expect(() => {
        service.createOrder('CUST-123', 'indian', []);
      }).toThrow('Invalid order data');
    });

    // TODO: Jules should add tests for:
    test.todo('should validate brand name');
    test.todo('should handle very long customer IDs');
    test.todo('should validate item structure');
    test.todo('should handle duplicate item IDs in single order');
  });

  describe('Order Retrieval', () => {
    test('should retrieve order by ID', () => {
      const created = service.createOrder('CUST-123', 'indian', sampleItems);
      const retrieved = service.getOrder(created.id);
      expect(retrieved).toBe(created);
    });

    test('should return undefined for non-existent order', () => {
      const result = service.getOrder('ORD-INVALID');
      expect(result).toBeUndefined();
    });

    test('should get all orders', () => {
      service.createOrder('CUST-123', 'indian', sampleItems);
      service.createOrder('CUST-124', 'thai', sampleItems);
      service.createOrder('CUST-125', 'italian', sampleItems);

      const all = service.getAllOrders();
      expect(all.length).toBe(3);
    });

    // TODO: Jules should add tests for:
    test.todo('should get orders by brand');
    test.todo('should filter orders by status');
    test.todo('should handle large number of orders efficiently');
    test.todo('should return orders in creation order');
  });

  describe('Order Status Updates', () => {
    test('should update order status', () => {
      const order = service.createOrder('CUST-123', 'indian', sampleItems);
      const updated = service.updateOrderStatus(order.id, 'confirmed');
      expect(updated.status).toBe('confirmed');
    });

    test('should throw error for non-existent order', () => {
      expect(() => {
        service.updateOrderStatus('ORD-INVALID', 'confirmed');
      }).toThrow('Order ORD-INVALID not found');
    });

    test('should throw error for invalid status', () => {
      const order = service.createOrder('CUST-123', 'indian', sampleItems);
      expect(() => {
        service.updateOrderStatus(order.id, 'invalid-status');
      }).toThrow('Invalid status');
    });

    // TODO: Jules should add tests for:
    test.todo('should prevent invalid state transitions');
    test.todo('should handle concurrent status updates');
    test.todo('should validate status transitions are logical');
  });

  describe('Order Cancellation', () => {
    test('should cancel pending order', () => {
      const order = service.createOrder('CUST-123', 'indian', sampleItems);
      const result = service.cancelOrder(order.id);
      expect(result.message).toContain('cancelled');
      expect(service.getOrder(order.id)).toBeUndefined();
    });

    test('should not cancel preparing order', () => {
      const order = service.createOrder('CUST-123', 'indian', sampleItems);
      order.updateStatus('preparing');
      expect(() => {
        service.cancelOrder(order.id);
      }).toThrow('Cannot cancel order');
    });

    // TODO: Jules should add tests for:
    test.todo('should handle refunds on cancellation');
    test.todo('should release inventory on cancellation');
    test.todo('should log cancellation reason');
    test.todo('should prevent double-cancellation');
  });

  describe('Analytics', () => {
    test('should calculate average prep time', () => {
      service.createOrder('CUST-123', 'indian', sampleItems);
      service.createOrder('CUST-124', 'indian', sampleItems);

      const avg = service.getAveragePrepTime('indian');
      expect(avg).toBeGreaterThan(0);
      expect(avg).toBeLessThanOrEqual(45);
    });

    // TODO: Jules should add tests for:
    test.todo('should calculate total orders by brand');
    test.todo('should get average order value');
    test.todo('should calculate peak order times');
    test.todo('should handle zero orders case');
  });
});
