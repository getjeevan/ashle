const AnalyticsService = require('../service');

describe('AnalyticsService', () => {
  let service;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  beforeEach(() => {
    service = new AnalyticsService();
  });

  describe('Daily Metrics Recording', () => {
    test('should record order in daily metrics', () => {
      service.recordOrder(today, 'indian', 500, 250);
      const metrics = service.getDailyMetrics(today);
      expect(metrics.totalOrders).toBe(1);
      expect(metrics.totalRevenue).toBe(500);
      expect(metrics.totalCosts).toBe(250);
    });

    test('should aggregate multiple orders', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(today, 'thai', 300, 150);
      service.recordOrder(today, 'italian', 400, 180);

      const metrics = service.getDailyMetrics(today);
      expect(metrics.totalOrders).toBe(3);
      expect(metrics.totalRevenue).toBe(1200);
      expect(metrics.totalCosts).toBe(580);
    });

    test('should calculate profit correctly', () => {
      service.recordOrder(today, 'indian', 500, 250);
      const metrics = service.getDailyMetrics(today);
      expect(metrics.totalProfit).toBe(250);
      expect(metrics.profitMargin).toBe('50.00');
    });

    test('should separate metrics by brand', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(today, 'thai', 300, 150);

      const metrics = service.getDailyMetrics(today);
      expect(metrics.brandMetrics.indian.orders).toBe(1);
      expect(metrics.brandMetrics.thai.orders).toBe(1);
    });

    // TODO: Jules should add tests for:
    test.todo('should handle zero revenue days');
    test.todo('should handle negative margins (losses)');
    test.todo('should validate revenue amounts');
  });

  describe('Waste Tracking', () => {
    test('should record waste in daily metrics', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordWaste(today, 'indian', 50);

      const metrics = service.getDailyMetrics(today);
      expect(metrics.totalWaste).toBe(50);
      expect(metrics.wastePercentage).toBe('10.00');
    });

    test('should separate waste by brand', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(today, 'thai', 300, 150);
      service.recordWaste(today, 'indian', 50);
      service.recordWaste(today, 'thai', 30);

      const metrics = service.getDailyMetrics(today);
      expect(metrics.brandMetrics.indian.waste).toBe(50);
      expect(metrics.brandMetrics.thai.waste).toBe(30);
    });

    // TODO: Jules should add tests for:
    test.todo('should identify high-waste items');
    test.todo('should track waste trends over time');
    test.todo('should calculate waste reduction targets');
  });

  describe('Item Analytics', () => {
    test('should add item analytics', () => {
      const item = service.addItemAnalytics('BIRYANI-001', 'Chicken Biryani', 'indian');
      expect(item.itemId).toBe('BIRYANI-001');
      expect(item.brand).toBe('indian');
    });

    test('should record item sale', () => {
      service.addItemAnalytics('BIRYANI-001', 'Chicken Biryani', 'indian');
      service.recordItemSale('BIRYANI-001', 10, 250, 120);

      const item = service.getItemAnalytics('BIRYANI-001');
      expect(item.totalSold).toBe(10);
      expect(item.totalRevenue).toBe(2500);
      expect(item.totalCost).toBe(1200);
    });

    test('should record item waste', () => {
      service.addItemAnalytics('BIRYANI-001', 'Chicken Biryani', 'indian');
      service.recordItemWaste('BIRYANI-001', 5);

      const item = service.getItemAnalytics('BIRYANI-001');
      expect(item.wasteCount).toBe(5);
    });

    test('should calculate item profit margin', () => {
      service.addItemAnalytics('BIRYANI-001', 'Chicken Biryani', 'indian');
      service.recordItemSale('BIRYANI-001', 10, 250, 120);

      const item = service.getItemAnalytics('BIRYANI-001');
      const profit = item.getProfit();
      const margin = item.getProfitMargin();
      expect(profit).toBe(1300); // (250-120)*10
      expect(margin).toBe('52.00');
    });

    test('should calculate waste percentage', () => {
      service.addItemAnalytics('BIRYANI-001', 'Chicken Biryani', 'indian');
      service.recordItemSale('BIRYANI-001', 100, 250, 120);
      service.recordItemWaste('BIRYANI-001', 10);

      const item = service.getItemAnalytics('BIRYANI-001');
      const wastePercentage = item.getWastePercentage();
      expect(wastePercentage).toBe('9.09');
    });

    // TODO: Jules should add tests for:
    test.todo('should handle items with zero sales');
    test.todo('should calculate cumulative metrics over time');
  });

  describe('Date Range Queries', () => {
    test('should get metrics for date range', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(yesterday, 'thai', 300, 150);

      const metrics = service.getMetricsForDateRange(yesterday, today);
      expect(metrics.length).toBe(2);
    });

    test('should return metrics in chronological order', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(yesterday, 'thai', 300, 150);

      const metrics = service.getMetricsForDateRange(yesterday, today);
      expect(metrics[0].date).toBe(yesterday);
      expect(metrics[1].date).toBe(today);
    });

    // TODO: Jules should add tests for:
    test.todo('should handle date range spanning months');
    test.todo('should handle single-day ranges');
    test.todo('should validate date format');
  });

  describe('Item Rankings', () => {
    test('should rank items by profitability', () => {
      service.addItemAnalytics('ITEM-1', 'Item 1', 'indian');
      service.addItemAnalytics('ITEM-2', 'Item 2', 'indian');

      service.recordItemSale('ITEM-1', 10, 100, 50); // Profit: 500
      service.recordItemSale('ITEM-2', 5, 200, 100);  // Profit: 500

      const ranked = service.getItemsByProfitability();
      expect(ranked.length).toBe(2);
      expect(ranked[0].totalProfit).toBeGreaterThanOrEqual(ranked[1].totalProfit);
    });

    test('should identify high-waste items', () => {
      service.addItemAnalytics('ITEM-1', 'Item 1', 'indian');
      service.recordItemSale('ITEM-1', 100, 100, 50);
      service.recordItemWaste('ITEM-1', 10); // 9.09% waste

      const highWaste = service.getHighWasteItems();
      expect(highWaste.some(i => i.itemId === 'ITEM-1')).toBe(true);
    });

    test('should rank items by sales volume', () => {
      service.addItemAnalytics('ITEM-1', 'Item 1', 'indian');
      service.addItemAnalytics('ITEM-2', 'Item 2', 'indian');

      service.recordItemSale('ITEM-1', 100, 100, 50);
      service.recordItemSale('ITEM-2', 50, 100, 50);

      const topSelling = service.getTopSellingItems(10);
      expect(topSelling[0].totalSold).toBe(100);
      expect(topSelling[1].totalSold).toBe(50);
    });

    // TODO: Jules should add tests for:
    test.todo('should filter items by brand');
    test.todo('should handle limit parameter in rankings');
  });

  describe('Business Summary', () => {
    test('should generate business summary', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(today, 'thai', 300, 150);
      service.recordWaste(today, 'indian', 50);

      const summary = service.getBusinessSummary(yesterday, today);
      expect(summary.totalOrders).toBeGreaterThan(0);
      expect(summary.totalRevenue).toBeGreaterThan(0);
      expect(summary.totalProfit).toBeGreaterThan(0);
    });

    test('should include brand breakdown in summary', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(today, 'thai', 300, 150);

      const summary = service.getBusinessSummary(today, today);
      expect(summary.byBrand.indian).toBeDefined();
      expect(summary.byBrand.thai).toBeDefined();
    });

    test('should calculate metrics for date range', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(yesterday, 'thai', 300, 150);

      const summary = service.getBusinessSummary(yesterday, today);
      expect(summary.totalOrders).toBe(2);
      expect(summary.totalRevenue).toBe(800);
    });

    // TODO: Jules should add tests for:
    test.todo('should handle empty date ranges');
    test.todo('should calculate month-over-month growth');
    test.todo('should identify best performing day');
    test.todo('should generate executive summary');
  });

  describe('Reporting', () => {
    test('should get all daily metrics', () => {
      service.recordOrder(today, 'indian', 500, 250);
      service.recordOrder(yesterday, 'thai', 300, 150);

      const all = service.getAllDailyMetrics();
      expect(all.length).toBe(2);
    });

    test('should get all item analytics', () => {
      service.addItemAnalytics('ITEM-1', 'Item 1', 'indian');
      service.addItemAnalytics('ITEM-2', 'Item 2', 'thai');

      const all = service.getAllItemAnalytics();
      expect(all.length).toBe(2);
    });

    // TODO: Jules should add tests for:
    test.todo('should generate PDF reports');
    test.todo('should export to CSV');
    test.todo('should generate comparison reports');
    test.todo('should create dashboard data');
  });
});
