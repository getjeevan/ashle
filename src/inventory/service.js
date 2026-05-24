// Inventory service
// Manages stock levels, reservations, and waste tracking

const InventoryItem = require('./model');

class InventoryService {
  constructor() {
    this.items = new Map(); // itemId -> InventoryItem
    this.reservations = new Map(); // orderId -> reserved items
  }

  addItem(itemId, name, brand, initialQuantity, minStock, price, cost) {
    if (this.items.has(itemId)) {
      throw new Error(`Item ${itemId} already exists`);
    }

    const item = new InventoryItem(itemId, name, brand, initialQuantity, minStock, price, cost);
    this.items.set(itemId, item);
    return item;
  }

  getItem(itemId) {
    return this.items.get(itemId);
  }

  getItemsByBrand(brand) {
    return Array.from(this.items.values()).filter(item => item.brand === brand);
  }

  getLowStockItems() {
    return Array.from(this.items.values()).filter(item => item.isLowStock());
  }

  getSoldOutItems() {
    return Array.from(this.items.values()).filter(item => item.isSoldOut());
  }

  // Reserve items for an order (prevents overselling with atomic operation)
  reserveForOrder(orderId, orderItems) {
    const reserved = [];

    try {
      for (const orderItem of orderItems) {
        const inventoryItem = this.getItem(orderItem.itemId);
        if (!inventoryItem) {
          throw new Error(`Item ${orderItem.itemId} not found`);
        }

        if (!inventoryItem.reserve(orderItem.quantity)) {
          throw new Error(`Insufficient stock for ${inventoryItem.name}`);
        }

        reserved.push({
          itemId: orderItem.itemId,
          quantity: orderItem.quantity,
          itemName: inventoryItem.name
        });
      }

      this.reservations.set(orderId, reserved);
      return { success: true, reserved };
    } catch (error) {
      // Rollback on any failure
      for (const item of reserved) {
        this.getItem(item.itemId).restockItem(item.quantity);
      }
      throw error;
    }
  }

  releaseReservation(orderId) {
    const reserved = this.reservations.get(orderId);
    if (reserved) {
      for (const item of reserved) {
        this.getItem(item.itemId).restockItem(item.quantity);
      }
      this.reservations.delete(orderId);
    }
  }

  confirmReservation(orderId) {
    this.reservations.delete(orderId);
  }

  restockItem(itemId, amount) {
    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }
    return item.restockItem(amount);
  }

  recordWaste(itemId, amount) {
    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }
    item.recordWaste(amount);
    return item;
  }

  getDailyWaste() {
    return Array.from(this.items.values()).map(item => ({
      itemId: item.itemId,
      name: item.name,
      wasteCount: item.wasteCount
    }));
  }

  getAllInventory() {
    return Array.from(this.items.values());
  }
}

module.exports = InventoryService;
