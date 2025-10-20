import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { 
  isTablet, 
  isLargeTablet,
  spacing, 
  borderRadius,
  iconSizes,
} from '../utils/responsive';
import { colors, typography, shadows } from '../utils/theme';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuSections = [
    {
      items: [
        { icon: 'person-outline', text: 'Personal Info', iconColor: colors.primary },
        { icon: 'location-outline', text: 'Addresses', iconColor: colors.primary },
        { icon: 'navigate-outline', text: 'Order Tracking', iconColor: colors.primary },
      ],
    },
    {
      items: [
        { icon: 'cart-outline', text: 'Cart', iconColor: colors.secondary },
        { icon: 'heart-outline', text: 'Favourites', iconColor: colors.secondary },
        { icon: 'notifications-outline', text: 'Notifications', iconColor: colors.secondary },
        { icon: 'card-outline', text: 'Payment Methods', iconColor: colors.secondary },
      ],
    },
    {
      items: [
        { icon: 'help-circle-outline', text: 'FAQs', iconColor: colors.textSecondary },
        { icon: 'star-outline', text: 'User Reviews', iconColor: colors.textSecondary },
        { icon: 'settings-outline', text: 'Settings', iconColor: colors.textSecondary },
        { icon: 'thumbs-up-outline', text: 'Rate Us', iconColor: colors.textSecondary },
      ],
    },
  ];

  const avatarSize = isLargeTablet ? 120 : isTablet ? 110 : 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/bunny.png')}
            style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
          />
          <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
            <Icon name="camera" size={iconSizes.sm} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user?.fullName || 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'guest@grabeat.com'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              activeOpacity={0.7}
              style={[
                styles.menuItem,
                itemIndex === section.items.length - 1 && styles.menuItemLast,
              ]}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
                  <Icon name={item.icon} size={iconSizes.md} color={item.iconColor} />
                </View>
                <Text style={styles.menuItemText}>{item.text}</Text>
              </View>
              <Icon name="chevron-forward" size={iconSizes.sm} color={colors.mediumGray} />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, styles.logoutIconContainer]}>
              <Icon name="log-out-outline" size={iconSizes.md} color={colors.white} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
          <Icon name="chevron-forward" size={iconSizes.sm} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
      
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: isTablet ? 36 : 32,
    height: isTablet ? 36 : 32,
    borderRadius: isTablet ? 18 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  userName: {
    fontSize: isTablet ? typography.fontSize['2xl'] : typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSize.md,
    color: colors.mediumGray,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.veryLightGray,
    paddingVertical: spacing.md,
    paddingHorizontal: isTablet ? spacing.xxxl : spacing.xl,
    borderRadius: borderRadius.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: isTablet ? typography.fontSize.xl : typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  statDivider: {
    width: 1,
    height: isTablet ? 35 : 30,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightGray,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  logoutIconContainer: {
    backgroundColor: colors.primary,
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  versionText: {
    textAlign: 'center',
    color: colors.mediumGray,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xxxl,
  },
});

export default Profile;
