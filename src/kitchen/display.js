// Kitchen display system model
// Shows orders to kitchen staff with prep status

class KitchenDisplay {
  constructor(orderId, brand, items, estimatedPrepTime) {
    this.orderId = orderId;
    this.brand = brand;
    this.items = items; // Array of {name, quantity, specialInstructions}
    this.estimatedPrepTime = estimatedPrepTime;
    this.status = 'pending'; // pending, cooking, ready
    this.startTime = null;
    this.completionTime = null;
    this.priority = this.calculatePriority();
  }

  calculatePriority() {
    // Orders with fewer items or longer wait times get lower priority
    if (this.items.length <= 2) return 'high';
    if (this.items.length <= 5) return 'medium';
    return 'low';
  }

  startCooking() {
    this.status = 'cooking';
    this.startTime = new Date();
  }

  markReady() {
    this.status = 'ready';
    this.completionTime = new Date();
  }

  getTimeRemaining() {
    if (this.status === 'ready') return 0;
    if (!this.startTime) return this.estimatedPrepTime;

    const elapsed = Math.floor((new Date() - this.startTime) / 60000); // minutes
    return Math.max(0, this.estimatedPrepTime - elapsed);
  }

  isOvertime() {
    if (!this.startTime) return false;
    const elapsed = Math.floor((new Date() - this.startTime) / 60000);
    return elapsed > this.estimatedPrepTime;
  }

  toJSON() {
    return {
      orderId: this.orderId,
      brand: this.brand,
      items: this.items,
      status: this.status,
      priority: this.priority,
      estimatedPrepTime: this.estimatedPrepTime,
      timeRemaining: this.getTimeRemaining(),
      isOvertime: this.isOvertime(),
      startTime: this.startTime,
      completionTime: this.completionTime
    };
  }
}

module.exports = KitchenDisplay;
