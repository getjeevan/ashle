// Order data model
// Defines the structure of orders in the system

class Order {
  constructor(id, customerId, brand, items, status = 'pending', createdAt = new Date()) {
    this.id = id;
    this.customerId = customerId;
    this.brand = brand; // 'indian', 'thai', 'italian'
    this.items = items; // Array of { itemId, quantity, price }
    this.status = status; // 'pending', 'confirmed', 'preparing', 'ready', 'delivered'
    this.totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.createdAt = createdAt;
    this.estimatedPrepTime = this.calculatePrepTime();
  }

  calculatePrepTime() {
    // Estimate based on number of items and complexity
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    return Math.min(5 + (itemCount * 2), 45); // 5-45 minutes
  }

  updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      brand: this.brand,
      items: this.items,
      status: this.status,
      totalPrice: this.totalPrice,
      estimatedPrepTime: this.estimatedPrepTime,
      createdAt: this.createdAt
    };
  }
}

module.exports = Order;
