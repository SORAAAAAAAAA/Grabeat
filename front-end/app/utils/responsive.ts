import React from 'react';
import { Dimensions, Platform, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints for different device sizes
export const BREAKPOINTS = {
  small: 375,    // Small phones
  medium: 414,   // Standard phones
  large: 768,    // Tablets
  xlarge: 1024,  // Large tablets / iPad Pro
  xxlarge: 1366, // Desktop / Large screens
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH < BREAKPOINTS.medium;
export const isMediumDevice = SCREEN_WIDTH >= BREAKPOINTS.medium && SCREEN_WIDTH < BREAKPOINTS.large;
export const isTablet = SCREEN_WIDTH >= BREAKPOINTS.large && SCREEN_WIDTH < BREAKPOINTS.xlarge;
export const isLargeTablet = SCREEN_WIDTH >= BREAKPOINTS.xlarge;
export const isWeb = Platform.OS === 'web';

// Orientation detection
export const isPortrait = SCREEN_HEIGHT > SCREEN_WIDTH;
export const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

/**
 * Scale size based on screen width
 * Use this for widths, margins, paddings
 */
export const scaleWidth = (size: number): number => {
  const baseWidth = 375; // iPhone 11 Pro width as base
  return (SCREEN_WIDTH / baseWidth) * size;
};

/**
 * Scale size based on screen height
 * Use this for heights, vertical margins
 */
export const scaleHeight = (size: number): number => {
  const baseHeight = 812; // iPhone 11 Pro height as base
  return (SCREEN_HEIGHT / baseHeight) * size;
};

/**
 * Moderate scale - scales less aggressively
 * Good for font sizes to prevent too large text on tablets
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Responsive font size based on screen width
 */
export const responsiveFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Get responsive value based on device type
 */
export const getResponsiveValue = <T,>(values: {
  small?: T;
  medium?: T;
  tablet?: T;
  large?: T;
  default: T;
}): T => {
  if (isLargeTablet && values.large) return values.large;
  if (isTablet && values.tablet) return values.tablet;
  if (isMediumDevice && values.medium) return values.medium;
  if (isSmallDevice && values.small) return values.small;
  return values.default;
};

/**
 * Get responsive spacing
 */
export const spacing = {
  xs: getResponsiveValue({ small: 4, tablet: 6, large: 8, default: 4 }),
  sm: getResponsiveValue({ small: 8, tablet: 10, large: 12, default: 8 }),
  md: getResponsiveValue({ small: 12, tablet: 16, large: 20, default: 12 }),
  lg: getResponsiveValue({ small: 16, tablet: 20, large: 24, default: 16 }),
  xl: getResponsiveValue({ small: 20, tablet: 28, large: 32, default: 20 }),
  xxl: getResponsiveValue({ small: 24, tablet: 32, large: 40, default: 24 }),
  xxxl: getResponsiveValue({ small: 32, tablet: 40, large: 48, default: 32 }),
};

/**
 * Get responsive border radius
 */
export const borderRadius = {
  sm: getResponsiveValue({ small: 8, tablet: 10, large: 12, default: 8 }),
  md: getResponsiveValue({ small: 12, tablet: 14, large: 16, default: 12 }),
  lg: getResponsiveValue({ small: 15, tablet: 18, large: 20, default: 15 }),
  xl: getResponsiveValue({ small: 20, tablet: 24, large: 28, default: 20 }),
  full: 9999,
};

/**
 * Get responsive icon sizes
 */
export const iconSizes = {
  xs: getResponsiveValue({ small: 14, tablet: 16, large: 18, default: 14 }),
  sm: getResponsiveValue({ small: 18, tablet: 20, large: 22, default: 18 }),
  md: getResponsiveValue({ small: 22, tablet: 26, large: 30, default: 22 }),
  lg: getResponsiveValue({ small: 28, tablet: 32, large: 36, default: 28 }),
  xl: getResponsiveValue({ small: 36, tablet: 42, large: 48, default: 36 }),
};

/**
 * Get responsive dimensions
 */
export const dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  containerMaxWidth: getResponsiveValue({
    small: SCREEN_WIDTH - 32,
    medium: SCREEN_WIDTH - 40,
    tablet: 720,
    large: 1200,
    default: SCREEN_WIDTH - 32,
  }),
  inputHeight: getResponsiveValue({ small: 48, tablet: 54, large: 60, default: 50 }),
  buttonHeight: getResponsiveValue({ small: 48, tablet: 54, large: 60, default: 50 }),
  headerHeight: getResponsiveValue({ small: 60, tablet: 70, large: 80, default: 60 }),
  tabBarHeight: getResponsiveValue({ small: 54, tablet: 64, large: 70, default: 54 }),
};

/**
 * Column layout helper for responsive grids
 */
export const getColumnWidth = (columns: number, spacing: number = 16): number => {
  const totalSpacing = spacing * (columns + 1);
  return (SCREEN_WIDTH - totalSpacing) / columns;
};

/**
 * Get number of columns based on screen size
 */
export const getColumnsForGrid = (maxColumns: number = 4): number => {
  if (isLargeTablet) return maxColumns;
  if (isTablet) return Math.max(3, maxColumns - 1);
  if (isMediumDevice) return 2;
  return 2;
};

/**
 * Platform specific values
 */
export const platformValue = <T,>(ios: T, android: T, web?: T): T => {
  if (Platform.OS === 'web' && web !== undefined) return web;
  return Platform.OS === 'ios' ? ios : android;
};

/**
 * Get safe padding for notched devices
 */
export const getSafeAreaPadding = () => {
  return {
    top: Platform.OS === 'ios' ? 44 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
  };
};

/**
 * Responsive hook - use with useState to update on rotation
 */
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = React.useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Export for external use
export default {
  scaleWidth,
  scaleHeight,
  moderateScale,
  responsiveFontSize,
  getResponsiveValue,
  spacing,
  borderRadius,
  iconSizes,
  dimensions,
  getColumnWidth,
  getColumnsForGrid,
  platformValue,
  getSafeAreaPadding,
  isSmallDevice,
  isMediumDevice,
  isTablet,
  isLargeTablet,
  isWeb,
  isPortrait,
  isLandscape,
  BREAKPOINTS,
};
