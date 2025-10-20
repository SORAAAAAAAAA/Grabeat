import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      paddingVertical: 40,
  
    },
    title: {
      fontSize: 37,
      fontWeight: '700',
      color: '#EF2A39',
      marginBottom: 40,
      letterSpacing: 2,
      marginRight: 220
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: 'black',
      borderWidth: 0.5,
      borderRadius: 15,
      paddingHorizontal: 20,
      marginBottom: 20,
      backgroundColor: '#fff',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#EF2A39',
      width: '100%',
      paddingVertical: 15,
      borderRadius: 15,
      alignItems: 'center',
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 }, // iOS shadow
      shadowOpacity: 0.25, // iOS shadow
      shadowRadius: 3.84, // iOS shadow
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    toggleText: {
      color: '#FFC42E',
      fontSize: 16,
      
    },
  
  
  });

  export default styles;