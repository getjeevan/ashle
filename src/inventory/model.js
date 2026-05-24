// Inventory item model
// Tracks stock levels and metadata for menu items

class InventoryItem {
  constructor(itemId, name, brand, quantity, minStock, price, cost) {
    this.itemId = itemId;
    this.name = name;
    this.brand = brand; // 'indian', 'thai', 'italian'
    this.quantity = quantity;
    this.minStock = minStock;
    this.price = price;
    this.cost = cost;
    this.lastRestocked = new Date();
    this.wasteCount = 0;
  }

  isLowStock() {
    return this.quantity <= this.minStock;
  }

  isSoldOut() {
    return this.quantity <= 0;
  }

  reserve(amount) {
    if (amount > this.quantity) {
      return false; // Cannot reserve more than available
    }
    this.quantity -= amount;
    return true;
  }

  restockItem(amount) {
    this.quantity += amount;
    this.lastRestocked = new Date();
    return this.quantity;
  }

  recordWaste(amount) {
    this.wasteCount += amount;
    this.quantity -= amount;
  }

  getProfit() {
    return (this.price - this.cost) * this.quantity;
  }

  toJSON() {
    return {
      itemId: this.itemId,
      name: this.name,
      brand: this.brand,
      quantity: this.quantity,
      minStock: this.minStock,
      price: this.price,
      cost: this.cost,
      isLowStock: this.isLowStock(),
      isSoldOut: this.isSoldOut(),
      wasteCount: this.wasteCount,
      lastRestocked: this.lastRestocked
    };
  }
}

module.exports = InventoryItem;
