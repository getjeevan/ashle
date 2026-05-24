// Order service
// Handles order creation, updates, and queries

const Order = require('./model');

class OrderService {
  constructor() {
    this.orders = new Map(); // In-memory storage (would be database in production)
    this.orderCounter = 1000;
  }

  createOrder(customerId, brand, items) {
    // Validate inputs
    if (!customerId || !brand || !items || items.length === 0) {
      throw new Error('Invalid order data');
    }

    const orderId = `ORD-${++this.orderCounter}`;
    const order = new Order(orderId, customerId, brand, items);
    this.orders.set(orderId, order);

    return order;
  }

  getOrder(orderId) {
    return this.orders.get(orderId);
  }

  getAllOrders() {
    return Array.from(this.orders.values());
  }

  getOrdersByBrand(brand) {
    return this.getAllOrders().filter(order => order.brand === brand);
  }

  getOrdersByStatus(status) {
    return this.getAllOrders().filter(order => order.status === status);
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (!order.updateStatus(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    return order;
  }

  cancelOrder(orderId) {
    const order = this.getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === 'preparing' || order.status === 'ready' || order.status === 'delivered') {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    this.orders.delete(orderId);
    return { message: `Order ${orderId} cancelled` };
  }

  getAveragePrepTime(brand = null) {
    const orders = brand ? this.getOrdersByBrand(brand) : this.getAllOrders();
    if (orders.length === 0) return 0;
    const total = orders.reduce((sum, order) => sum + order.estimatedPrepTime, 0);
    return Math.round(total / orders.length);
  }
}

module.exports = OrderService;
