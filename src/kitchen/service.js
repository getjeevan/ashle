// Kitchen service
// Manages kitchen operations and prep tracking

const KitchenDisplay = require('./display');

class KitchenService {
  constructor() {
    this.displays = new Map(); // orderId -> KitchenDisplay
    this.cookingQueue = []; // Orders currently being prepared
  }

  addOrderToKitchen(orderId, brand, items, estimatedPrepTime) {
    const display = new KitchenDisplay(orderId, brand, items, estimatedPrepTime);
    this.displays.set(orderId, display);
    return display;
  }

  getDisplay(orderId) {
    return this.displays.get(orderId);
  }

  getAllDisplays() {
    return Array.from(this.displays.values());
  }

  // Get kitchen display sorted by priority and wait time
  getKitchenQueue() {
    const pending = this.getAllDisplays()
      .filter(d => d.status === 'pending' || d.status === 'cooking')
      .sort((a, b) => {
        // Overtime orders first
        if (a.isOvertime() && !b.isOvertime()) return -1;
        if (!a.isOvertime() && b.isOvertime()) return 1;

        // Then by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Then by time remaining
        return a.getTimeRemaining() - b.getTimeRemaining();
      });

    return pending;
  }

  startCooking(orderId) {
    const display = this.getDisplay(orderId);
    if (!display) {
      throw new Error(`Order ${orderId} not found`);
    }
    display.startCooking();
    return display;
  }

  markOrderReady(orderId) {
    const display = this.getDisplay(orderId);
    if (!display) {
      throw new Error(`Order ${orderId} not found`);
    }
    display.markReady();
    return display;
  }

  completeOrder(orderId) {
    const display = this.displays.get(orderId);
    if (!display) {
      throw new Error(`Order ${orderId} not found`);
    }
    this.displays.delete(orderId);
    return display;
  }

  getAveragePrepTime(brand = null) {
    const displays = brand
      ? this.getAllDisplays().filter(d => d.brand === brand && d.completionTime)
      : this.getAllDisplays().filter(d => d.completionTime);

    if (displays.length === 0) return 0;
    const total = displays.reduce((sum, d) => {
      const prepTime = Math.floor((d.completionTime - d.startTime) / 60000);
      return sum + prepTime;
    }, 0);
    return Math.round(total / displays.length);
  }

  getOvertimeOrders() {
    return this.getAllDisplays().filter(d => d.isOvertime());
  }

  getOrdersByStatus(status) {
    return this.getAllDisplays().filter(d => d.status === status);
  }

  getKitchenMetrics() {
    const all = this.getAllDisplays();
    const completed = all.filter(d => d.completionTime);
    const overtime = all.filter(d => d.isOvertime());

    return {
      totalOrders: all.length,
      completedOrders: completed.length,
      overtimeOrders: overtime.length,
      averagePrepTime: this.getAveragePrepTime(),
      overtimePercentage: all.length > 0 ? (overtime.length / all.length) * 100 : 0,
      currentQueue: this.getKitchenQueue().length
    };
  }
}

module.exports = KitchenService;
