import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import CheckBox from 'expo-checkbox';
import { useAuth } from './context/AuthContext';
import { 
  isTablet, 
  isLargeTablet, 
  responsiveFontSize, 
  spacing, 
  borderRadius,
  dimensions,
} from './utils/responsive';
import { colors, typography, shadows } from './utils/theme';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

const LogSign: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const API_URL = 'http://localhost:3000';

  const { login } = useAuth();

  // Show notification with animation
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 4 seconds
    setTimeout(() => {
      hideNotification();
    }, 4000);
  };

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
    });
  };

  // Reset animations when notification changes
  useEffect(() => {
    if (!notification) {
      fadeAnim.setValue(0);
      slideAnim.setValue(-100);
    }
  }, [notification]);

  const handleRegister = async () => {
    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, phoneNumber, email, password, confirmPassword }),
      });
      const data = await response.json();
      
      if (response.status === 201) {
        showNotification(data.message || 'Account created successfully!', 'success');
        
        if (data.token) {
          await login(data.token, {
            email,
            fullName,
            phoneNumber,
            id: data.userId || data.id,
          });
        } else {
          // Clear form and switch to login
          setFullName('');
          setPhoneNumber('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTimeout(() => setIsSignUp(false), 1500);
        }
      } else {
        showNotification(data.error || data.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('Unable to connect to server. Please check your connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showNotification('Please enter your email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.status === 200) {
        if (data.token) {
          await login(data.token, {
            email,
            fullName: data.fullName || data.user?.fullName,
            phoneNumber: data.phoneNumber || data.user?.phoneNumber,
            id: data.userId || data.user?.id || data.id,
          });
          showNotification(data.message || 'Welcome back!', 'success');
        } else {
          showNotification('Authentication failed. Please try again.', 'error');
        }
      } else {
        showNotification(data.error || data.message || 'Invalid email or password', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('Unable to connect to server. Please check your connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setFullName('');
    setPhoneNumber('');
    setConfirmPassword('');
  };

  const getInputStyle = (field: string) => [
    styles.input,
    focusedInput === field && styles.inputFocused,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Modern Toast Notification */}
      {notification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
            notification.type === 'success' && styles.notificationSuccess,
            notification.type === 'error' && styles.notificationError,
            notification.type === 'info' && styles.notificationInfo,
          ]}
        >
          <View style={styles.notificationContent}>
            <Text style={styles.notificationIcon}>
              {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
            </Text>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
          <TouchableOpacity onPress={hideNotification} style={styles.notificationClose}>
            <Text style={styles.notificationCloseText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Text>
          </View>

          {/* Sign Up Fields */}
          {isSignUp && (
            <>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={getInputStyle('fullName')}
                  placeholder="Full Name"
                  placeholderTextColor={colors.textPlaceholder}
                  value={fullName}
                  onChangeText={setFullName}
                  keyboardType="default"
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={getInputStyle('phoneNumber')}
                  placeholder="Phone Number"
                  placeholderTextColor={colors.textPlaceholder}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedInput('phoneNumber')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </>
          )}

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={getInputStyle('email')}
              placeholder="Email"
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={getInputStyle('password')}
              placeholder="Password"
              placeholderTextColor={colors.textPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Confirm Password (Sign Up) */}
          {isSignUp && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={getInputStyle('confirmPassword')}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textPlaceholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          )}

          {/* Remember Me & Forgot Password (Login) */}
          {!isSignUp && (
            <View style={styles.rememberContainer}>
              <Pressable
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}
              >
                <CheckBox 
                  value={isChecked} 
                  onValueChange={setIsChecked} 
                  color={colors.accent} 
                />
                <Text style={styles.checkboxLabel}>Remember Me</Text>
              </Pressable>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={isSignUp ? handleRegister : handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color={colors.white} size="small" style={styles.loadingIcon} />
                <Text style={styles.buttonText}>Please wait...</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Log In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Login/Signup */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{'  '}
              <Text onPress={handleToggle} style={styles.toggleLink}>
                {isSignUp ? 'Log In' : 'Sign Up'}
              </Text>
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              {isSignUp ? 'Or Login with' : 'Or Sign up with'}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Image
                style={styles.socialIcon}
                source={require('../assets/images/Facebook.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Image
                style={styles.socialIcon}
                source={require('../assets/images/Google.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Terms & Privacy (Sign Up) */}
          {isSignUp && (
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up you agree with our{' '}
                <Text style={styles.termsLink}>Terms of Use</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // Modern Notification Styles
  notificationContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.xl,
    elevation: 8,
  },
  notificationSuccess: {
    backgroundColor: '#10B981',
  },
  notificationError: {
    backgroundColor: '#EF4444',
  },
  notificationInfo: {
    backgroundColor: '#3B82F6',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.md,
  },
  notificationText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  notificationClose: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  notificationCloseText: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxxl,
  },
  formContainer: {
    width: '100%',
    maxWidth: isLargeTablet ? 600 : isTablet ? 500 : 400,
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: isLargeTablet ? typography.fontSize['6xl'] : isTablet ? typography.fontSize['5xl'] : typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.widest,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    height: dimensions.inputHeight,
    borderColor: colors.border,
    borderWidth: 0.5,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    fontSize: typography.fontSize.base,
    ...shadows.xs,
  },
  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
    ...shadows.md,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  forgotPassword: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.accent,
    width: '100%',
    height: dimensions.buttonHeight,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    flexDirection: 'row',
    ...shadows.lg,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  loadingIcon: {
    marginRight: spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  toggleText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  toggleLink: {
    color: colors.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  dividerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.sm,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.border,
    flex: 1,
  },
  dividerText: {
    fontSize: typography.fontSize.base,
    paddingHorizontal: spacing.sm,
    color: colors.textSecondary,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  socialButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.veryLightGray,
    ...shadows.sm,
  },
  socialIcon: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
  },
  termsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  termsText: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  termsLink: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default LogSign;
