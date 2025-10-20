import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
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
  getColumnWidth,
  getColumnsForGrid,
} from '../utils/responsive';
import { colors, typography, shadows } from '../utils/theme';

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Non Veg');

  const categories = [
    { id: 1, name: 'Non Veg', icon: '🍗' },
    { id: 2, name: 'Veg', icon: '🥗' },
    { id: 3, name: 'Spicy', icon: '🌶️' },
    { id: 4, name: 'Pizza', icon: '🍕' },
  ];

  const categorySize = getColumnWidth(4, spacing.sm);
  const dishCardWidth = isLargeTablet ? 200 : isTablet ? 180 : 160;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Welcome Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Good Morning,{'\n'}
          <Text style={styles.titleAccent}>Have a good day!</Text>
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon name="search-outline" size={iconSizes.md} color={colors.darkGray} style={styles.searchIcon} />
        <TextInput
          placeholderTextColor={colors.darkGray}
          style={styles.searchBar}
          placeholder="Search dishes, restaurants"
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Icon name="mic-outline" size={iconSizes.md} color={colors.darkGray} />
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <View style={styles.imageContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            onPress={() => setSelectedCategory(category.name)}
            style={[
              styles.categoryCard,
              selectedCategory === category.name && styles.categoryCardActive,
            ]}
          >
            <View
              style={[
                styles.categoryImageWrapper,
                selectedCategory === category.name && styles.categoryImageWrapperActive,
              ]}
            >
              <Image
                style={styles.categoryImage}
                source={
                  index === 0
                    ? require('../../assets/images/image _rowM.png')
                    : index === 1
                    ? require('../../assets/images/image _rowM2.png')
                    : index === 2
                    ? require('../../assets/images/image _rowM3.png')
                    : require('../../assets/images/image _rowM4.png')
                }
              />
            </View>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popular Dishes Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Dishes</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {[1, 2, 3, 4, 5].map((item, index) => (
          <TouchableOpacity key={item} activeOpacity={0.8} style={[styles.dishCard, { width: dishCardWidth }]}>
            <Image
              style={[styles.dishImage, { width: dishCardWidth, height: dishCardWidth * 0.9 }]}
              source={
                index % 2 === 0
                  ? require('../../assets/images/5.png')
                  : require('../../assets/images/4.png')
              }
            />
            <View style={styles.dishCardContent}>
              <View style={styles.dishRating}>
                <Icon name="star" size={iconSizes.sm} color={colors.secondary} />
                <Text style={styles.ratingText}>4.{5 - index}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Banner */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Offers</Text>
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.bannerContainer}>
        <Image style={styles.bannerImage} source={require('../../assets/images/hor_img.png')} />
        <View style={styles.bannerOverlay}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>30% OFF</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Nearby Restaurants Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.restaurantList}>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity key={item} activeOpacity={0.8} style={styles.restaurantCard}>
            <View style={styles.restaurantImage}>
              <Icon name="restaurant" size={iconSizes.lg} color={colors.primary} />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>Restaurant {item}</Text>
              <View style={styles.restaurantMeta}>
                <Icon name="location" size={iconSizes.xs} color={colors.textSecondary} />
                <Text style={styles.restaurantDistance}>2.{item} km</Text>
                <Icon name="star" size={iconSizes.xs} color={colors.secondary} style={styles.ratingIcon} />
                <Text style={styles.restaurantRating}>4.{8 - item}</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={iconSizes.sm} color={colors.mediumGray} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  titleContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: isLargeTablet ? typography.fontSize['3xl'] : isTablet ? typography.fontSize['2xl'] : typography.fontSize.xl,
    lineHeight: isLargeTablet ? typography.fontSize['3xl'] * 1.4 : isTablet ? typography.fontSize['2xl'] * 1.4 : typography.fontSize.xl * 1.4,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  titleAccent: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchBar: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.darkGray,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  categoryCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryImageWrapper: {
    padding: isTablet ? spacing.sm : spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.veryLightGray,
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  categoryImageWrapperActive: {
    backgroundColor: '#FFF3E0',
    ...shadows.md,
  },
  categoryImage: {
    width: isLargeTablet ? 70 : isTablet ? 65 : 55,
    height: isLargeTablet ? 70 : isTablet ? 65 : 55,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: isTablet ? typography.fontSize.md : typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: isTablet ? typography.fontSize.xl : typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
  },
  dishCard: {
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.md,
  },
  dishImage: {
    borderRadius: borderRadius.lg,
  },
  dishCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: spacing.sm,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  dishRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  bannerContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  bannerImage: {
    width: '100%',
    height: isLargeTablet ? 220 : isTablet ? 190 : 160,
    borderRadius: borderRadius.lg,
  },
  bannerOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  discountText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  restaurantList: {
    paddingHorizontal: spacing.lg,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  restaurantImage: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: borderRadius.sm,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantDistance: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  ratingIcon: {
    marginLeft: spacing.sm,
  },
  restaurantRating: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
});

export default MainPage;
