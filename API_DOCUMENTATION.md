# Ashle API Documentation

Complete API reference for the Ashle cloud kitchen management system.

## Base URL
```
http://localhost:3000/api
```

## Health Check

### Get Server Status
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ashle-cloud-kitchen",
  "version": "0.1.0",
  "timestamp": "2024-05-24T10:30:00Z",
  "modules": ["orders", "inventory", "kitchen", "delivery", "analytics"]
}
```

---

## Orders API

### Create Order
```
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "CUST-123",
  "brand": "indian",
  "items": [
    {
      "itemId": "BIRYANI-001",
      "quantity": 2,
      "price": 250
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "ORD-1001",
  "customerId": "CUST-123",
  "brand": "indian",
  "items": [...],
  "status": "pending",
  "totalPrice": 500,
  "estimatedPrepTime": 20,
  "createdAt": "2024-05-24T10:30:00Z"
}
```

### List All Orders
```
GET /api/orders
```

**Response:** `200 OK`
```json
[
  { /* order objects */ }
]
```

### Get Order Details
```
GET /api/orders/:orderId
```

**Response:** `200 OK`
```json
{ /* order object */ }
```

### Update Order Status
```
PATCH /api/orders/:orderId/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Statuses:** `pending`, `confirmed`, `preparing`, `ready`, `delivered`

---

## Inventory API

### Add Inventory Item
```
POST /api/inventory/items
Content-Type: application/json
```

**Request Body:**
```json
{
  "itemId": "BIRYANI-001",
  "name": "Chicken Biryani",
  "brand": "indian",
  "quantity": 50,
  "minStock": 10,
  "price": 250,
  "cost": 120
}
```

**Response:** `201 Created`
```json
{
  "itemId": "BIRYANI-001",
  "name": "Chicken Biryani",
  "brand": "indian",
  "quantity": 50,
  "minStock": 10,
  "price": 250,
  "cost": 120,
  "isLowStock": false,
  "isSoldOut": false,
  "wasteCount": 0
}
```

### List All Inventory
```
GET /api/inventory
```

**Response:** `200 OK`
```json
[
  { /* inventory items */ }
]
```

### Get Low Stock Items
```
GET /api/inventory/low-stock
```

**Response:** `200 OK` - Returns items where quantity ≤ minStock

### Reserve Items for Order
```
POST /api/inventory/reserve
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "ORD-1001",
  "items": [
    {
      "itemId": "BIRYANI-001",
      "quantity": 2
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "reserved": [
    {
      "itemId": "BIRYANI-001",
      "quantity": 2,
      "itemName": "Chicken Biryani"
    }
  ]
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Insufficient stock for Chicken Biryani"
}
```

### Record Waste
```
POST /api/inventory/waste
Content-Type: application/json
```

**Request Body:**
```json
{
  "itemId": "BIRYANI-001",
  "amount": 3
}
```

**Response:** `200 OK`
```json
{
  "itemId": "BIRYANI-001",
  "name": "Chicken Biryani",
  "quantity": 47,
  "wasteCount": 3
}
```

---

## Kitchen Display API

### Add Order to Kitchen Display
```
POST /api/kitchen/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "ORD-1001",
  "brand": "indian",
  "items": [
    {
      "name": "Chicken Biryani",
      "quantity": 2,
      "specialInstructions": "Less spicy"
    }
  ],
  "estimatedPrepTime": 20
}
```

**Response:** `201 Created`
```json
{
  "orderId": "ORD-1001",
  "brand": "indian",
  "items": [...],
  "status": "pending",
  "priority": "high",
  "estimatedPrepTime": 20,
  "timeRemaining": 20,
  "isOvertime": false
}
```

### Get Kitchen Queue
```
GET /api/kitchen/display
```

**Response:** `200 OK` - Returns orders sorted by priority and wait time
```json
[
  { /* display items sorted by priority */ }
]
```

### Start Cooking Order
```
PATCH /api/kitchen/orders/:orderId/start
```

**Response:** `200 OK`
```json
{
  "orderId": "ORD-1001",
  "status": "cooking",
  "startTime": "2024-05-24T10:35:00Z"
}
```

### Mark Order Ready
```
PATCH /api/kitchen/orders/:orderId/ready
```

**Response:** `200 OK`
```json
{
  "orderId": "ORD-1001",
  "status": "ready",
  "completionTime": "2024-05-24T10:55:00Z"
}
```

### Get Kitchen Metrics
```
GET /api/kitchen/metrics
```

**Response:** `200 OK`
```json
{
  "totalOrders": 45,
  "completedOrders": 38,
  "overtimeOrders": 2,
  "averagePrepTime": 18,
  "overtimePercentage": 4.4,
  "currentQueue": 7
}
```

---

## Delivery API

### Add Delivery Partner
```
POST /api/delivery/partners
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "FastDelivery Partner 1",
  "rating": 4.8
}
```

**Response:** `201 Created`
```json
{
  "name": "FastDelivery Partner 1",
  "activeDeliveries": 0,
  "totalDeliveries": 0,
  "avgRating": 4.8
}
```

### Create Delivery
```
POST /api/delivery
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "ORD-1001",
  "customerId": "CUST-123",
  "address": "123 Main St, Mumbai",
  "lat": 19.0760,
  "lng": 72.8777
}
```

**Response:** `201 Created`
```json
{
  "deliveryId": "DEL-5001",
  "orderId": "ORD-1001",
  "customerId": "CUST-123",
  "address": "123 Main St, Mumbai",
  "coordinates": {
    "lat": 19.0760,
    "lng": 72.8777
  },
  "status": "pending",
  "estimatedDeliveryTime": 30
}
```

### Assign Partner to Delivery
```
POST /api/delivery/:deliveryId/assign
```

**Response:** `200 OK` - Automatically selects best available partner
```json
{
  "deliveryId": "DEL-5001",
  "partnerName": "FastDelivery Partner 1",
  "status": "assigned"
}
```

### Get Delivery Details
```
GET /api/delivery/:deliveryId
```

**Response:** `200 OK`
```json
{
  "deliveryId": "DEL-5001",
  "status": "assigned",
  "partnerName": "FastDelivery Partner 1"
}
```

### Mark as Picked Up
```
PATCH /api/delivery/:deliveryId/picked-up
```

**Response:** `200 OK`
```json
{
  "deliveryId": "DEL-5001",
  "status": "picked_up",
  "pickedUpAt": "2024-05-24T11:00:00Z"
}
```

### Mark as In Transit
```
PATCH /api/delivery/:deliveryId/in-transit
```

**Response:** `200 OK`
```json
{
  "deliveryId": "DEL-5001",
  "status": "in_transit"
}
```

### Complete Delivery
```
PATCH /api/delivery/:deliveryId/complete
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5,
  "notes": "Excellent service"
}
```

**Response:** `200 OK`
```json
{
  "deliveryId": "DEL-5001",
  "status": "delivered",
  "deliveredAt": "2024-05-24T11:30:00Z",
  "rating": 5,
  "actualDeliveryTime": 30
}
```

### Get Delivery Metrics
```
GET /api/delivery/metrics
```

**Response:** `200 OK`
```json
{
  "totalDeliveries": 150,
  "completedDeliveries": 145,
  "pendingDeliveries": 3,
  "inTransit": 2,
  "averageDeliveryTime": 28,
  "averageRating": "4.7",
  "activePartners": 3,
  "totalPartners": 5
}
```

---

## Analytics API

### Get Daily Metrics
```
GET /api/analytics/daily/:date
```

**Parameters:**
- `date`: `YYYY-MM-DD` format

**Response:** `200 OK`
```json
{
  "date": "2024-05-24",
  "totalOrders": 45,
  "totalRevenue": 10500,
  "totalCosts": 5250,
  "totalProfit": 5250,
  "profitMargin": "50.00",
  "totalWaste": 150,
  "wastePercentage": "1.43",
  "brandMetrics": {
    "indian": {
      "orders": 20,
      "revenue": 5000,
      "costs": 2500,
      "waste": 50
    }
  }
}
```

### Get Metrics for Date Range
```
GET /api/analytics/range
```

**Query Parameters:**
- `startDate`: `YYYY-MM-DD` format
- `endDate`: `YYYY-MM-DD` format

**Response:** `200 OK`
```json
[
  { /* daily metrics for each day in range */ }
]
```

### Get Business Summary
```
GET /api/analytics/summary
```

**Query Parameters (Optional):**
- `startDate`: Default: 30 days ago
- `endDate`: Default: today

**Response:** `200 OK`
```json
{
  "periodStart": "2024-04-24",
  "periodEnd": "2024-05-24",
  "totalOrders": 1200,
  "totalRevenue": 280000,
  "totalCosts": 140000,
  "totalProfit": 140000,
  "profitMargin": "50.00",
  "totalWaste": 3500,
  "wastePercentage": "1.25",
  "byBrand": {
    "indian": {
      "orders": 500,
      "revenue": 125000,
      "costs": 62500,
      "waste": 1500
    }
  }
}
```

### Get Top Selling Items
```
GET /api/analytics/items/top-selling
```

**Query Parameters (Optional):**
- `limit`: Number of items to return (default: 10)

**Response:** `200 OK`
```json
[
  {
    "itemId": "BIRYANI-001",
    "name": "Chicken Biryani",
    "brand": "indian",
    "totalSold": 450,
    "totalRevenue": 112500,
    "totalProfit": 56250,
    "profitMargin": "50.00"
  }
]
```

### Get High Waste Items
```
GET /api/analytics/items/high-waste
```

**Response:** `200 OK` - Returns items with waste > 5%
```json
[
  {
    "itemId": "ITEM-001",
    "name": "Item Name",
    "wasteCount": 25,
    "wastePercentage": "8.50"
  }
]
```

### Get Items by Profitability
```
GET /api/analytics/items/profitability
```

**Response:** `200 OK` - Sorted by profit (highest first)
```json
[
  {
    "itemId": "ITEM-001",
    "name": "Item Name",
    "totalProfit": 56250,
    "profitMargin": "50.00"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Description of what went wrong"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```

---

## Example Workflow

### 1. Create Order
```bash
POST /api/orders
{
  "customerId": "CUST-123",
  "brand": "indian",
  "items": [{"itemId": "BIRYANI-001", "quantity": 1, "price": 250}]
}
→ Response: {"id": "ORD-1001", ...}
```

### 2. Reserve Inventory
```bash
POST /api/inventory/reserve
{
  "orderId": "ORD-1001",
  "items": [{"itemId": "BIRYANI-001", "quantity": 1}]
}
```

### 3. Send to Kitchen
```bash
POST /api/kitchen/orders
{
  "orderId": "ORD-1001",
  "brand": "indian",
  "items": [...],
  "estimatedPrepTime": 20
}
```

### 4. Create Delivery
```bash
POST /api/delivery
{
  "orderId": "ORD-1001",
  "customerId": "CUST-123",
  "address": "...",
  "lat": 19.0760,
  "lng": 72.8777
}
```

### 5. Assign Delivery Partner
```bash
POST /api/delivery/DEL-5001/assign
→ Auto-assigns best available partner
```

### 6. Update Status
```bash
PATCH /api/kitchen/orders/ORD-1001/ready
PATCH /api/delivery/DEL-5001/complete
```

### 7. Check Analytics
```bash
GET /api/analytics/summary
→ View profitability, waste, performance
```

---

## Rate Limiting

No rate limiting is currently implemented. Future versions will include:
- 1000 requests per minute per IP
- 10000 requests per hour per API key

## Authentication

Currently no authentication is required. Future versions will support:
- API keys
- OAuth 2.0
- JWT tokens

---

Generated automatically by Jules AI ✨
Last updated: May 24, 2024
