// Analytics models
// Track metrics for waste, profitability, and performance

class DailyMetrics {
  constructor(date = new Date()) {
    this.date = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
    this.totalOrders = 0;
    this.totalRevenue = 0;
    this.totalCosts = 0;
    this.totalWaste = 0;
    this.averagePrepTime = 0;
    this.averageDeliveryTime = 0;
    this.brandMetrics = {}; // brand -> {orders, revenue, costs, waste}
    this.peakHours = {}; // hour -> order count
  }

  addOrder(brand, revenue, cost) {
    this.totalOrders += 1;
    this.totalRevenue += revenue;
    this.totalCosts += cost;

    if (!this.brandMetrics[brand]) {
      this.brandMetrics[brand] = { orders: 0, revenue: 0, costs: 0, waste: 0 };
    }
    this.brandMetrics[brand].orders += 1;
    this.brandMetrics[brand].revenue += revenue;
    this.brandMetrics[brand].costs += cost;
  }

  recordWaste(brand, wasteValue) {
    this.totalWaste += wasteValue;
    if (this.brandMetrics[brand]) {
      this.brandMetrics[brand].waste += wasteValue;
    }
  }

  recordPeakHour(hour) {
    this.peakHours[hour] = (this.peakHours[hour] || 0) + 1;
  }

  getProfit() {
    return this.totalRevenue - this.totalCosts;
  }

  getProfitMargin() {
    if (this.totalRevenue === 0) return 0;
    return ((this.getProfit() / this.totalRevenue) * 100).toFixed(2);
  }

  getBrandMetrics(brand) {
    return this.brandMetrics[brand] || null;
  }

  toJSON() {
    return {
      date: this.date,
      totalOrders: this.totalOrders,
      totalRevenue: this.totalRevenue,
      totalCosts: this.totalCosts,
      totalProfit: this.getProfit(),
      profitMargin: this.getProfitMargin(),
      totalWaste: this.totalWaste,
      wastePercentage: this.totalRevenue > 0 ? ((this.totalWaste / this.totalRevenue) * 100).toFixed(2) : 0,
      averagePrepTime: this.averagePrepTime,
      averageDeliveryTime: this.averageDeliveryTime,
      brandMetrics: this.brandMetrics,
      peakHours: this.peakHours
    };
  }
}

class ItemAnalytics {
  constructor(itemId, name, brand) {
    this.itemId = itemId;
    this.name = name;
    this.brand = brand;
    this.totalSold = 0;
    this.totalRevenue = 0;
    this.totalCost = 0;
    this.wasteCount = 0;
    this.lastUpdated = new Date();
  }

  recordSale(quantity, unitPrice, unitCost) {
    this.totalSold += quantity;
    this.totalRevenue += quantity * unitPrice;
    this.totalCost += quantity * unitCost;
  }

  recordWaste(quantity) {
    this.wasteCount += quantity;
  }

  getProfit() {
    return this.totalRevenue - this.totalCost;
  }

  getProfitMargin() {
    if (this.totalRevenue === 0) return 0;
    return ((this.getProfit() / this.totalRevenue) * 100).toFixed(2);
  }

  getWastePercentage() {
    const total = this.totalSold + this.wasteCount;
    if (total === 0) return 0;
    return ((this.wasteCount / total) * 100).toFixed(2);
  }

  toJSON() {
    return {
      itemId: this.itemId,
      name: this.name,
      brand: this.brand,
      totalSold: this.totalSold,
      totalRevenue: this.totalRevenue,
      totalCost: this.totalCost,
      totalProfit: this.getProfit(),
      profitMargin: this.getProfitMargin(),
      wasteCount: this.wasteCount,
      wastePercentage: this.getWastePercentage()
    };
  }
}

module.exports = {
  DailyMetrics,
  ItemAnalytics
};
