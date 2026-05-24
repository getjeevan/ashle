// Ashle Cloud Kitchen Management System
// Main entry point with integrated modules

const express = require('express');
const dotenv = require('dotenv');

// Import services
const OrderService = require('./orders/service');
const InventoryService = require('./inventory/service');
const KitchenService = require('./kitchen/service');
const DeliveryService = require('./delivery/service');
const AnalyticsService = require('./analytics/service');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const orderService = new OrderService();
const inventoryService = new InventoryService();
const kitchenService = new KitchenService();
const deliveryService = new DeliveryService();
const analyticsService = new AnalyticsService();

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ashle-cloud-kitchen',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    modules: ['orders', 'inventory', 'kitchen', 'delivery', 'analytics']
  });
});

// ===== ORDERS API =====
app.post('/api/orders', (req, res) => {
  try {
    const { customerId, brand, items } = req.body;
    const order = orderService.createOrder(customerId, brand, items);
    res.status(201).json(order.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders', (req, res) => {
  res.json(orderService.getAllOrders().map(o => o.toJSON()));
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = orderService.getOrder(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order.toJSON());
});

app.patch('/api/orders/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = orderService.updateOrderStatus(req.params.orderId, status);
    res.json(order.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== INVENTORY API =====
app.post('/api/inventory/items', (req, res) => {
  try {
    const { itemId, name, brand, quantity, minStock, price, cost } = req.body;
    const item = inventoryService.addItem(itemId, name, brand, quantity, minStock, price, cost);
    res.status(201).json(item.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/inventory', (req, res) => {
  res.json(inventoryService.getAllInventory().map(i => i.toJSON()));
});

app.get('/api/inventory/low-stock', (req, res) => {
  res.json(inventoryService.getLowStockItems().map(i => i.toJSON()));
});

app.post('/api/inventory/reserve', (req, res) => {
  try {
    const { orderId, items } = req.body;
    const result = inventoryService.reserveForOrder(orderId, items);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/inventory/waste', (req, res) => {
  try {
    const { itemId, amount } = req.body;
    const item = inventoryService.recordWaste(itemId, amount);
    res.json(item.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== KITCHEN DISPLAY API =====
app.post('/api/kitchen/orders', (req, res) => {
  try {
    const { orderId, brand, items, estimatedPrepTime } = req.body;
    const display = kitchenService.addOrderToKitchen(orderId, brand, items, estimatedPrepTime);
    res.status(201).json(display.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/kitchen/display', (req, res) => {
  res.json(kitchenService.getKitchenQueue().map(d => d.toJSON()));
});

app.patch('/api/kitchen/orders/:orderId/start', (req, res) => {
  try {
    const display = kitchenService.startCooking(req.params.orderId);
    res.json(display.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/kitchen/orders/:orderId/ready', (req, res) => {
  try {
    const display = kitchenService.markOrderReady(req.params.orderId);
    res.json(display.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/kitchen/metrics', (req, res) => {
  res.json(kitchenService.getKitchenMetrics());
});

// ===== DELIVERY API =====
app.post('/api/delivery/partners', (req, res) => {
  try {
    const { name, rating } = req.body;
    const partner = deliveryService.addPartner(name, rating);
    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/delivery', (req, res) => {
  try {
    const { orderId, customerId, address, lat, lng } = req.body;
    const delivery = deliveryService.createDelivery(orderId, customerId, address, lat, lng);
    res.status(201).json(delivery.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/delivery/:deliveryId/assign', (req, res) => {
  try {
    const delivery = deliveryService.assignPartner(req.params.deliveryId);
    res.json(delivery.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/delivery/:deliveryId', (req, res) => {
  const delivery = deliveryService.getDelivery(req.params.deliveryId);
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
  res.json(delivery.toJSON());
});

app.patch('/api/delivery/:deliveryId/picked-up', (req, res) => {
  try {
    const delivery = deliveryService.markPickedUp(req.params.deliveryId);
    res.json(delivery.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/delivery/:deliveryId/in-transit', (req, res) => {
  try {
    const delivery = deliveryService.markInTransit(req.params.deliveryId);
    res.json(delivery.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/delivery/:deliveryId/complete', (req, res) => {
  try {
    const { rating, notes } = req.body;
    const delivery = deliveryService.completeDelivery(req.params.deliveryId, rating, notes);
    res.json(delivery.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/delivery/metrics', (req, res) => {
  res.json(deliveryService.getDeliveryMetrics());
});

// ===== ANALYTICS API =====
app.get('/api/analytics/daily/:date', (req, res) => {
  const metrics = analyticsService.getDailyMetrics(req.params.date);
  if (!metrics) return res.status(404).json({ error: 'No metrics for this date' });
  res.json(metrics.toJSON());
});

app.get('/api/analytics/range', (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate required' });
  }
  const metrics = analyticsService.getMetricsForDateRange(startDate, endDate);
  res.json(metrics.map(m => m.toJSON()));
});

app.get('/api/analytics/summary', (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const end = endDate || new Date().toISOString().split('T')[0];
  const summary = analyticsService.getBusinessSummary(start, end);
  res.json(summary);
});

app.get('/api/analytics/items/top-selling', (req, res) => {
  const limit = req.query.limit || 10;
  res.json(analyticsService.getTopSellingItems(limit).map(i => i.toJSON()));
});

app.get('/api/analytics/items/high-waste', (req, res) => {
  res.json(analyticsService.getHighWasteItems().map(i => i.toJSON()));
});

app.get('/api/analytics/items/profitability', (req, res) => {
  res.json(analyticsService.getItemsByProfitability().map(i => i.toJSON()));
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Ashle server running on port ${PORT}`);
  console.log(`✓ Jules AI integration enabled`);
  console.log(`✓ Modules: Orders, Inventory, Kitchen, Delivery, Analytics`);
  console.log(`✓ Ready for development`);
});

module.exports = app;
