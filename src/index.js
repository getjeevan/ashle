// Ashle Cloud Kitchen Management System
// Main entry point

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ashle-cloud-kitchen',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes (to be implemented)
app.get('/api/orders', (req, res) => {
  res.json({ message: 'Orders endpoint - Coming soon' });
});

app.get('/api/inventory', (req, res) => {
  res.json({ message: 'Inventory endpoint - Coming soon' });
});

app.get('/api/kitchen/display', (req, res) => {
  res.json({ message: 'Kitchen display - Coming soon' });
});

app.get('/api/analytics/waste', (req, res) => {
  res.json({ message: 'Waste analytics - Coming soon' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Ashle server running on port ${PORT}`);
  console.log(`✓ Jules AI integration enabled`);
  console.log(`✓ Ready for development`);
});

module.exports = app;
