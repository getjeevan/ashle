// Delivery service
// Manages delivery coordination and partner assignments

const Delivery = require('./model');

class DeliveryService {
  constructor() {
    this.deliveries = new Map(); // deliveryId -> Delivery
    this.partners = new Map(); // partnerName -> {name, activeDeliveries, totalDeliveries, rating}
    this.deliveryCounter = 5000;
  }

  // Initialize available delivery partners
  addPartner(partnerName, rating = 4.5) {
    if (this.partners.has(partnerName)) {
      throw new Error(`Partner ${partnerName} already exists`);
    }
    this.partners.set(partnerName, {
      name: partnerName,
      activeDeliveries: 0,
      totalDeliveries: 0,
      avgRating: rating,
      availableSince: new Date()
    });
    return this.partners.get(partnerName);
  }

  createDelivery(orderId, customerId, address, lat, lng) {
    const deliveryId = `DEL-${++this.deliveryCounter}`;
    const delivery = new Delivery(deliveryId, orderId, customerId, address, lat, lng);
    this.deliveries.set(deliveryId, delivery);
    return delivery;
  }

  getDelivery(deliveryId) {
    return this.deliveries.get(deliveryId);
  }

  getAllDeliveries() {
    return Array.from(this.deliveries.values());
  }

  // Smart partner assignment - choose partner with lowest active deliveries and high rating
  assignPartner(deliveryId) {
    const delivery = this.getDelivery(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ${deliveryId} not found`);
    }

    const availablePartners = Array.from(this.partners.values())
      .filter(p => p.activeDeliveries < 5) // Max 5 active per partner
      .sort((a, b) => {
        // Sort by active deliveries (fewer is better) then by rating (higher is better)
        if (a.activeDeliveries !== b.activeDeliveries) {
          return a.activeDeliveries - b.activeDeliveries;
        }
        return b.avgRating - a.avgRating;
      });

    if (availablePartners.length === 0) {
      throw new Error('No available delivery partners');
    }

    const partner = availablePartners[0];
    delivery.assignPartner(partner.name);
    partner.activeDeliveries += 1;

    return delivery;
  }

  markPickedUp(deliveryId) {
    const delivery = this.getDelivery(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ${deliveryId} not found`);
    }
    delivery.markPickedUp();
    return delivery;
  }

  markInTransit(deliveryId) {
    const delivery = this.getDelivery(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ${deliveryId} not found`);
    }
    delivery.markInTransit();
    return delivery;
  }

  completeDelivery(deliveryId, rating, notes = '') {
    const delivery = this.getDelivery(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ${deliveryId} not found`);
    }

    delivery.completeDelivery(rating, notes);

    // Update partner stats
    const partner = this.partners.get(delivery.partnerName);
    if (partner) {
      partner.activeDeliveries -= 1;
      partner.totalDeliveries += 1;
      // Update average rating
      partner.avgRating = (partner.avgRating * (partner.totalDeliveries - 1) + rating) / partner.totalDeliveries;
    }

    return delivery;
  }

  cancelDelivery(deliveryId) {
    const delivery = this.getDelivery(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ${deliveryId} not found`);
    }

    delivery.cancelDelivery();

    // Update partner stats if assigned
    if (delivery.partnerName) {
      const partner = this.partners.get(delivery.partnerName);
      if (partner && delivery.status === 'cancelled') {
        partner.activeDeliveries = Math.max(0, partner.activeDeliveries - 1);
      }
    }

    return delivery;
  }

  getDeliveriesByStatus(status) {
    return this.getAllDeliveries().filter(d => d.status === status);
  }

  getDeliveriesByPartner(partnerName) {
    return this.getAllDeliveries().filter(d => d.partnerName === partnerName);
  }

  getPartnerStats(partnerName) {
    const partner = this.partners.get(partnerName);
    if (!partner) {
      throw new Error(`Partner ${partnerName} not found`);
    }

    const deliveries = this.getDeliveriesByPartner(partnerName);
    const completed = deliveries.filter(d => d.status === 'delivered');

    return {
      ...partner,
      completedDeliveries: completed.length,
      averageDeliveryTime: completed.length > 0
        ? Math.round(completed.reduce((sum, d) => sum + (d.getDeliveryTime() || 0), 0) / completed.length)
        : 0
    };
  }

  getDeliveryMetrics() {
    const all = this.getAllDeliveries();
    const completed = all.filter(d => d.status === 'delivered');
    const pending = all.filter(d => d.status === 'pending' || d.status === 'assigned');

    return {
      totalDeliveries: all.length,
      completedDeliveries: completed.length,
      pendingDeliveries: pending.length,
      inTransit: all.filter(d => d.status === 'in_transit').length,
      averageDeliveryTime: completed.length > 0
        ? Math.round(completed.reduce((sum, d) => sum + (d.getDeliveryTime() || 0), 0) / completed.length)
        : 0,
      averageRating: completed.length > 0
        ? (completed.reduce((sum, d) => sum + (d.rating || 0), 0) / completed.length).toFixed(2)
        : 'N/A',
      activePartners: Array.from(this.partners.values()).filter(p => p.activeDeliveries > 0).length,
      totalPartners: this.partners.size
    };
  }
}

module.exports = DeliveryService;
