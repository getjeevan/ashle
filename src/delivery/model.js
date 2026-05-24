// Delivery model
// Tracks delivery orders and partner coordination

class Delivery {
  constructor(deliveryId, orderId, customerId, address, lat, lng, partnerName = null) {
    this.deliveryId = deliveryId;
    this.orderId = orderId;
    this.customerId = customerId;
    this.address = address;
    this.coordinates = { lat, lng };
    this.partnerName = partnerName; // Assigned delivery partner
    this.status = 'pending'; // pending, assigned, picked_up, in_transit, delivered, cancelled
    this.createdAt = new Date();
    this.pickedUpAt = null;
    this.deliveredAt = null;
    this.estimatedDeliveryTime = this.calculateETA();
    this.rating = null;
    this.deliveryNotes = '';
  }

  calculateETA() {
    // Simple ETA calculation based on distance (in real app, use actual routing)
    // Assuming average delivery speed of 15 km/h in urban area
    // For now, estimate 25-35 minutes
    return 30; // minutes
  }

  assignPartner(partnerName) {
    if (this.status !== 'pending') {
      throw new Error('Cannot assign partner to non-pending delivery');
    }
    this.partnerName = partnerName;
    this.status = 'assigned';
    return this;
  }

  markPickedUp() {
    if (this.status !== 'assigned') {
      throw new Error('Cannot mark as picked up - delivery not assigned');
    }
    this.status = 'picked_up';
    this.pickedUpAt = new Date();
    return this;
  }

  markInTransit() {
    if (this.status !== 'picked_up') {
      throw new Error('Cannot mark as in transit - order not picked up');
    }
    this.status = 'in_transit';
    return this;
  }

  completeDelivery(rating, notes = '') {
    if (this.status !== 'in_transit') {
      throw new Error('Cannot complete delivery - not in transit');
    }
    this.status = 'delivered';
    this.deliveredAt = new Date();
    this.rating = Math.min(5, Math.max(1, rating)); // Clamp 1-5
    this.deliveryNotes = notes;
    return this;
  }

  cancelDelivery() {
    if (['delivered', 'cancelled'].includes(this.status)) {
      throw new Error(`Cannot cancel delivery with status: ${this.status}`);
    }
    this.status = 'cancelled';
    return this;
  }

  getDeliveryTime() {
    if (!this.deliveredAt || !this.pickedUpAt) return null;
    return Math.floor((this.deliveredAt - this.pickedUpAt) / 60000); // minutes
  }

  toJSON() {
    return {
      deliveryId: this.deliveryId,
      orderId: this.orderId,
      customerId: this.customerId,
      address: this.address,
      coordinates: this.coordinates,
      partnerName: this.partnerName,
      status: this.status,
      estimatedDeliveryTime: this.estimatedDeliveryTime,
      actualDeliveryTime: this.getDeliveryTime(),
      rating: this.rating,
      createdAt: this.createdAt,
      pickedUpAt: this.pickedUpAt,
      deliveredAt: this.deliveredAt
    };
  }
}

module.exports = Delivery;
