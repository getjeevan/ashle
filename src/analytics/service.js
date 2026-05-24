// Analytics service
// Tracks business metrics, waste, profitability, and performance

const { DailyMetrics, ItemAnalytics } = require('./model');

class AnalyticsService {
  constructor() {
    this.dailyMetrics = new Map(); // date (YYYY-MM-DD) -> DailyMetrics
    this.itemAnalytics = new Map(); // itemId -> ItemAnalytics
  }

  // Record an order in daily metrics
  recordOrder(date, brand, totalRevenue, totalCost) {
    const dateStr = new Date(date).toISOString().split('T')[0];

    if (!this.dailyMetrics.has(dateStr)) {
      this.dailyMetrics.set(dateStr, new DailyMetrics(dateStr));
    }

    const metrics = this.dailyMetrics.get(dateStr);
    metrics.addOrder(brand, totalRevenue, totalCost);
    return metrics;
  }

  // Record waste in daily metrics
  recordWaste(date, brand, wasteValue) {
    const dateStr = new Date(date).toISOString().split('T')[0];

    if (!this.dailyMetrics.has(dateStr)) {
      this.dailyMetrics.set(dateStr, new DailyMetrics(dateStr));
    }

    const metrics = this.dailyMetrics.get(dateStr);
    metrics.recordWaste(brand, wasteValue);
    return metrics;
  }

  // Track item-level analytics
  addItemAnalytics(itemId, name, brand) {
    if (this.itemAnalytics.has(itemId)) {
      return this.itemAnalytics.get(itemId);
    }

    const analytics = new ItemAnalytics(itemId, name, brand);
    this.itemAnalytics.set(itemId, analytics);
    return analytics;
  }

  getItemAnalytics(itemId) {
    return this.itemAnalytics.get(itemId);
  }

  recordItemSale(itemId, quantity, unitPrice, unitCost) {
    const analytics = this.itemAnalytics.get(itemId);
    if (!analytics) {
      throw new Error(`Item ${itemId} not found in analytics`);
    }
    analytics.recordSale(quantity, unitPrice, unitCost);
    return analytics;
  }

  recordItemWaste(itemId, quantity) {
    const analytics = this.itemAnalytics.get(itemId);
    if (!analytics) {
      throw new Error(`Item ${itemId} not found in analytics`);
    }
    analytics.recordWaste(quantity);
    return analytics;
  }

  // Get metrics for a specific date
  getDailyMetrics(dateStr) {
    return this.dailyMetrics.get(dateStr);
  }

  // Get metrics for date range
  getMetricsForDateRange(startDate, endDate) {
    const start = new Date(startDate).toISOString().split('T')[0];
    const end = new Date(endDate).toISOString().split('T')[0];

    const metrics = [];
    for (const [dateStr, dailyMetrics] of this.dailyMetrics) {
      if (dateStr >= start && dateStr <= end) {
        metrics.push(dailyMetrics);
      }
    }

    return metrics.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Get all items by profitability (highest profit first)
  getItemsByProfitability() {
    return Array.from(this.itemAnalytics.values())
      .sort((a, b) => b.getProfit() - a.getProfit());
  }

  // Get items with high waste percentage
  getHighWasteItems() {
    return Array.from(this.itemAnalytics.values())
      .filter(item => parseFloat(item.getWastePercentage()) > 5)
      .sort((a, b) => parseFloat(b.getWastePercentage()) - parseFloat(a.getWastePercentage()));
  }

  // Get items by sales volume
  getTopSellingItems(limit = 10) {
    return Array.from(this.itemAnalytics.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
  }

  // Get items by brand
  getItemsByBrand(brand) {
    return Array.from(this.itemAnalytics.values())
      .filter(item => item.brand === brand);
  }

  // Get business summary for date range
  getBusinessSummary(startDate, endDate) {
    const metrics = this.getMetricsForDateRange(startDate, endDate);

    if (metrics.length === 0) {
      return {
        periodStart: startDate,
        periodEnd: endDate,
        totalOrders: 0,
        totalRevenue: 0,
        totalCosts: 0,
        totalProfit: 0,
        averageProfitMargin: 0,
        totalWaste: 0,
        message: 'No data for this period'
      };
    }

    const summary = {
      periodStart: startDate,
      periodEnd: endDate,
      totalOrders: 0,
      totalRevenue: 0,
      totalCosts: 0,
      totalWaste: 0,
      byBrand: {}
    };

    for (const daily of metrics) {
      summary.totalOrders += daily.totalOrders;
      summary.totalRevenue += daily.totalRevenue;
      summary.totalCosts += daily.totalCosts;
      summary.totalWaste += daily.totalWaste;

      // Aggregate by brand
      for (const [brand, metrics] of Object.entries(daily.brandMetrics)) {
        if (!summary.byBrand[brand]) {
          summary.byBrand[brand] = { orders: 0, revenue: 0, costs: 0, waste: 0 };
        }
        summary.byBrand[brand].orders += metrics.orders;
        summary.byBrand[brand].revenue += metrics.revenue;
        summary.byBrand[brand].costs += metrics.costs;
        summary.byBrand[brand].waste += metrics.waste;
      }
    }

    summary.totalProfit = summary.totalRevenue - summary.totalCosts;
    summary.profitMargin = summary.totalRevenue > 0
      ? ((summary.totalProfit / summary.totalRevenue) * 100).toFixed(2)
      : 0;
    summary.wastePercentage = summary.totalRevenue > 0
      ? ((summary.totalWaste / summary.totalRevenue) * 100).toFixed(2)
      : 0;

    return summary;
  }

  // Get all daily metrics
  getAllDailyMetrics() {
    return Array.from(this.dailyMetrics.values())
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  // Get all item analytics
  getAllItemAnalytics() {
    return Array.from(this.itemAnalytics.values());
  }
}

module.exports = AnalyticsService;
