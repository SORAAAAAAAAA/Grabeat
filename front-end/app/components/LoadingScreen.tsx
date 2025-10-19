import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';





const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Always call the font loading hook at the top level, not inside any conditionals
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // After 3 seconds, hide loading screen
    }, 3000);
  }, []);

  // Ensure fonts are loaded before rendering
  if (!fontsLoaded) {
    return (
      <LinearGradient
        colors={['#FF939B', '#F65864', '#EF2A39']}
        style={styles.gradientContainer}
      >
        <View style={styles.container}>
          <Text style={styles.text}>Loading Fonts...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FF939B', '#F65864', '#EF2A39']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        {isLoading ? (
          <>
            <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
            <Text style={styles.text}>GRABEAT</Text>
          </>
        ) : (
          <Text style={styles.text}>App is ready!</Text>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    marginTop: -150,  // Remove margin bottom to eliminate the space below the image
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#FFC42E',
    marginTop: -125, // Ensure no margin top for the text
  },
});


export default LoadingScreen;
