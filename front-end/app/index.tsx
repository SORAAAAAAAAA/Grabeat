import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingScreen from './components/LoadingScreen';
import LogSign from './LogSign';
import MainPage from './components/MainPage';
import Search from './components/Search';
import Orders from './components/Orders';
import Profile from './components/Profile';
import CustomHeader from './components/CustomHeader';
import CustomHeaderOrders from './components/CustomHeaderOrders';
import CustomHeaderProf from './components/CustomHeaderProf';
import { AuthProvider, useAuth } from './context/AuthContext';
import { dimensions, iconSizes } from './utils/responsive';
import { colors } from './utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tabs Navigator (Protected Routes)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Orders') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Profiles') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Icon name={iconName} size={iconSizes.md} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: dimensions.tabBarHeight,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={MainPage}
      options={({ navigation }) => ({
        tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        header: () => <CustomHeader title="Home" navigation={navigation} />,
      })}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      options={({ navigation }) => ({
        tabBarIcon: ({ color, size }) => <Icon name="search-outline" color={color} size={size} />,
        header: () => <CustomHeader title="Search" navigation={navigation} />,
      })}
    />
    <Tab.Screen
      name="Orders"
      component={Orders}
      options={({ navigation }) => ({
        tabBarIcon: ({ color, size }) => <Icon name="document-text-outline" color={color} size={size} />,
        header: () => <CustomHeaderOrders title="Orders" navigation={navigation} />,
      })}
    />
    <Tab.Screen
      name="Profiles"
      component={Profile}
      options={({ navigation }) => ({
        tabBarIcon: ({ color, size }) => <Icon name="person-outline" color={color} size={size} />,
        header: () => <CustomHeaderProf title="Profile" navigation={navigation} />,
      })}
    />
  </Tab.Navigator>
);

// Navigation Component with Auth Logic
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen during app initialization
  if (!isAppReady) {
    return <LoadingScreen />;
  }

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF2A39" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Protected Routes (User is logged in)
          <>
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        ) : (
          // Public Routes (User is NOT logged in)
          <>
            <Stack.Screen name="Auth" component={LogSign} />
          </>
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

// Root App Component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default App;