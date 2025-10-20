import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type TabType = 'Active' | 'Completed' | 'Cancelled';

interface Order {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  status: string;
  time: string;
  date: string;
  statusColor?: string;
  rating?: number;
  reason?: string;
}

const Orders = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Active');
  const { width } = Dimensions.get('window');

  const tabs: TabType[] = ['Active', 'Completed', 'Cancelled'];

  const orders: Record<TabType, Order[]> = {
    Active: [
      {
        id: '#ORD-2024-001',
        restaurant: 'The Great Burger',
        items: ['Classic Burger', 'French Fries', 'Coke'],
        total: 24.99,
        status: 'Preparing',
        time: '15-20 min',
        date: 'Today, 2:30 PM',
        statusColor: '#FF9500',
      },
      {
        id: '#ORD-2024-002',
        restaurant: 'Sushi Palace',
        items: ['California Roll', 'Miso Soup'],
        total: 32.50,
        status: 'On the way',
        time: '5-10 min',
        date: 'Today, 3:15 PM',
        statusColor: '#34C759',
      },
    ],
    Completed: [
      {
        id: '#ORD-2023-099',
        restaurant: 'Pizza House',
        items: ['Margherita Pizza', 'Garlic Bread'],
        total: 28.00,
        status: 'Delivered',
        time: '',
        date: 'Yesterday, 7:45 PM',
        rating: 4.5,
      },
      {
        id: '#ORD-2023-098',
        restaurant: 'Thai Delight',
        items: ['Pad Thai', 'Spring Rolls', 'Tom Yum Soup'],
        total: 45.75,
        status: 'Delivered',
        time: '',
        date: 'Jan 15, 6:20 PM',
        rating: 5,
      },
    ],
    Cancelled: [
      {
        id: '#ORD-2023-097',
        restaurant: 'Mexican Fiesta',
        items: ['Tacos', 'Nachos'],
        total: 22.50,
        status: 'Cancelled',
        time: '',
        date: 'Jan 14, 5:00 PM',
        reason: 'Restaurant closed',
      },
    ],
  };

  const currentOrders = orders[activeTab];

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : star - 0.5 === rating ? 'star-half' : 'star-outline'}
            size={14}
            color="#FFC42E"
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.filterButton}>
          <Icon name="filter-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt-outline" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>No {activeTab} Orders</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'Active'
                ? 'Order your favorite food to get started'
                : `You don't have any ${activeTab.toLowerCase()} orders yet`}
            </Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentOrders.map((order: Order, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={styles.orderCard}
            >
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: order.statusColor || '#999' + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: order.statusColor || '#999' },
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Restaurant Name */}
              <View style={styles.restaurantRow}>
                <Icon name="restaurant-outline" size={18} color="#666" />
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
              </View>

              {/* Items */}
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsLabel}>Items:</Text>
                <Text style={styles.itemsText}>{order.items.join(', ')}</Text>
              </View>

              {/* Footer */}
              <View style={styles.orderFooter}>
                <View style={styles.footerLeft}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
                </View>

                {activeTab === 'Active' && order.time && (
                  <View style={styles.timeContainer}>
                    <Icon name="time-outline" size={16} color="#E95322" />
                    <Text style={styles.timeText}>{order.time}</Text>
                  </View>
                )}

                {activeTab === 'Completed' && order.rating && (
                  <View style={styles.ratingContainer}>
                    {renderStars(order.rating)}
                    <Text style={styles.ratingText}>{order.rating}</Text>
                  </View>
                )}

                {activeTab === 'Cancelled' && order.reason && (
                  <Text style={styles.reasonText}>{order.reason}</Text>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                {activeTab === 'Active' && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.actionButton, styles.trackButton]}
                    >
                      <Icon name="location-outline" size={18} color="#fff" />
                      <Text style={styles.trackButtonText}>Track Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.actionButton, styles.contactButton]}
                    >
                      <Icon name="call-outline" size={18} color="#E95322" />
                      <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </>
                )}

                {activeTab === 'Completed' && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.actionButton, styles.reorderButton]}
                    >
                      <Icon name="repeat-outline" size={18} color="#fff" />
                      <Text style={styles.reorderButtonText}>Reorder</Text>
                    </TouchableOpacity>
                    {!order.rating && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.actionButton, styles.rateButton]}
                      >
                        <Icon name="star-outline" size={18} color="#E95322" />
                        <Text style={styles.rateButtonText}>Rate</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {activeTab === 'Cancelled' && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.actionButton, styles.reorderButton]}
                  >
                    <Icon name="repeat-outline" size={18} color="#fff" />
                    <Text style={styles.reorderButtonText}>Order Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // Active tab styling
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: '#E95322',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#E95322',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  scrollContent: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  itemsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E95322',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2EF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 13,
    color: '#E95322',
    fontWeight: '600',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  reasonText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  trackButton: {
    backgroundColor: '#E95322',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E95322',
  },
  contactButtonText: {
    color: '#E95322',
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    backgroundColor: '#E95322',
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E95322',
  },
  rateButtonText: {
    color: '#E95322',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  browseButton: {
    backgroundColor: '#E95322',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Orders;