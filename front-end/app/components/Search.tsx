import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  isTablet, 
  isLargeTablet,
  spacing, 
  borderRadius,
  iconSizes,
  getColumnsForGrid,
} from '../utils/responsive';
import { colors, typography, shadows } from '../utils/theme';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Restaurants', 'Dishes', 'Categories', 'Offers'];
  
  const recentSearches = [
    'Pizza Margherita',
    'Sushi Restaurant',
    'Vegan Food',
    'Italian Cuisine',
    'Fast Food Near Me',
  ];

  const popularSearches = [
    { icon: '🍕', text: 'Pizza' },
    { icon: '🍔', text: 'Burgers' },
    { icon: '🍣', text: 'Sushi' },
    { icon: '🍝', text: 'Pasta' },
    { icon: '🌮', text: 'Tacos' },
    { icon: '🍜', text: 'Ramen' },
  ];

  const cuisines = [
    { name: 'Italian', icon: '🍝' },
    { name: 'Chinese', icon: '🥡' },
    { name: 'Japanese', icon: '🍱' },
    { name: 'Mexican', icon: '🌮' },
    { name: 'Indian', icon: '🍛' },
    { name: 'Thai', icon: '🍜' },
  ];

  const columns = getColumnsForGrid(3);
  const cardWidthPercent = `${100 / columns - 3}%` as any;

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Icon name="search-outline" size={iconSizes.sm} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search for dishes, restaurants..."
            placeholderTextColor={colors.mediumGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Icon name="close-circle" size={iconSizes.sm} color={colors.mediumGray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterPill,
                activeFilter === filter && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={styles.recentItem}
              >
                <Icon name="time-outline" size={iconSizes.sm} color={colors.textSecondary} />
                <Text style={styles.recentText}>{search}</Text>
                <Icon name="arrow-up-outline" size={iconSizes.sm} color={colors.mediumGray} style={styles.arrowIcon} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Popular Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          
          <View style={styles.popularGrid}>
            {popularSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={[styles.popularCard, { width: cardWidthPercent }]}
              >
                <Text style={styles.popularIcon}>{item.icon}</Text>
                <Text style={styles.popularText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Now */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <Icon name="trending-up" size={iconSizes.sm} color={colors.primary} />
          </View>

          <View style={styles.trendingList}>
            {['Chicken Biryani', 'Margherita Pizza', 'Caesar Salad', 'Pad Thai'].map(
              (item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={styles.trendingItem}
                >
                  <View style={styles.trendingNumber}>
                    <Text style={styles.trendingNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.trendingText}>{item}</Text>
                  <Icon name="chevron-forward" size={iconSizes.sm} color={colors.mediumGray} />
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Cuisines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Cuisine</Text>
          
          <View style={styles.cuisineGrid}>
            {cuisines.map((cuisine, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={[styles.cuisineCard, { width: cardWidthPercent }]}
              >
                <Text style={styles.cuisineIcon}>{cuisine.icon}</Text>
                <Text style={styles.cuisineName}>{cuisine.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.veryLightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchBar: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  filterContainer: {
    paddingBottom: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.veryLightGray,
    marginRight: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: isTablet ? typography.fontSize.xl : typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  clearText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightGray,
  },
  recentText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  arrowIcon: {
    transform: [{ rotate: '45deg' }],
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginTop: spacing.sm,
  },
  popularCard: {
    aspectRatio: 1,
    backgroundColor: colors.veryLightGray,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.xs,
    ...shadows.sm,
  },
  popularIcon: {
    fontSize: isTablet ? 36 : 32,
    marginBottom: spacing.sm,
  },
  popularText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  trendingList: {
    marginTop: spacing.sm,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  trendingNumber: {
    width: isTablet ? 32 : 28,
    height: isTablet ? 32 : 28,
    borderRadius: isTablet ? 16 : 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  trendingNumberText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  trendingText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginTop: spacing.sm,
  },
  cuisineCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.xs,
  },
  cuisineIcon: {
    fontSize: isTablet ? 32 : 28,
    marginBottom: spacing.sm,
  },
  cuisineName: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default Search;
