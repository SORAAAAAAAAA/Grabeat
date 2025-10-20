import { responsiveFontSize, spacing, borderRadius } from './responsive';

/**
 * Responsive Theme Configuration
 * All values scale based on device size
 */

// Colors
export const colors = {
  // Primary
  primary: '#E95322',
  primaryDark: '#D43F10',
  primaryLight: '#FF6B3D',
  
  // Secondary
  secondary: '#FFC42E',
  secondaryDark: '#F5B800',
  secondaryLight: '#FFD76B',
  
  // Accent
  accent: '#EF2A39',
  accentDark: '#D61F2D',
  accentLight: '#FF4757',
  
  // Neutrals
  black: '#000000',
  darkGray: '#32343E',
  gray: '#666666',
  mediumGray: '#999999',
  lightGray: '#CCCCCC',
  veryLightGray: '#F5F5F5',
  white: '#FFFFFF',
  
  // Status
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#F5F5F5',
  
  // Text
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  textPlaceholder: '#AAAAAA',
  
  // Borders
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Shadows
  shadowLight: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
};

// Typography - Responsive font sizes
export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font sizes (responsive)
  fontSize: {
    xs: responsiveFontSize(10),
    sm: responsiveFontSize(12),
    md: responsiveFontSize(14),
    base: responsiveFontSize(16),
    lg: responsiveFontSize(18),
    xl: responsiveFontSize(20),
    '2xl': responsiveFontSize(24),
    '3xl': responsiveFontSize(28),
    '4xl': responsiveFontSize(32),
    '5xl': responsiveFontSize(37),
    '6xl': responsiveFontSize(42),
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

// Spacing (responsive)
export const layoutSpacing = spacing;

// Border radius (responsive)
export const layoutBorderRadius = borderRadius;

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Common component styles (responsive)
export const components = {
  // Button
  button: {
    height: responsiveFontSize(50),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  
  // Input
  input: {
    height: responsiveFontSize(50),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
  },
  
  // Card
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  
  // Container
  container: {
    paddingHorizontal: spacing.lg,
  },
  
  // Header
  header: {
    height: responsiveFontSize(60),
    paddingHorizontal: spacing.lg,
  },
  
  // Tab bar
  tabBar: {
    height: responsiveFontSize(54),
  },
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Z-Index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
};

// Export theme object
export const theme = {
  colors,
  typography,
  spacing: layoutSpacing,
  borderRadius: layoutBorderRadius,
  shadows,
  components,
  animation,
  zIndex,
};

export default theme;
