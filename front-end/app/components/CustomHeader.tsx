import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const CustomHeader: React.FC<{ title: string; navigation: any }> = ({ title, navigation }) => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.loc}>
          <Icon name="location" size={25} color="#D42323" />
        </View>
        <View style={styles.locContainer}>
          <Text style={styles.headerTitle}>DELIVER TO</Text>
          <Text style={styles.headLoc}>Dasmarinas City, Cavite</Text>
        </View>
        <View style={styles.headIC}>
          <Icon name="chevron-down-outline" size={25} color="#000000" style={styles.headerIcons} />
          <Icon name="notifications-outline" size={25} color="#E95322" style={styles.headerIcons} />
            <Icon name="bag-outline" size={25} color="#E95322" style={styles.headerIcons} />

        </View>
      </View>
    );
  };

const styles  = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      headerTitle: {
        color: '#E95322',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins-SemiBold',
      },
      headLoc: {
        fontFamily: 'Poppins-SemiBold',
      },
      headIC: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      headerIcons: {
        marginHorizontal: 5,
      },
      loc: {
        marginLeft:20,
      },
      locContainer: {
        marginRight: 40.
      }
})

export default CustomHeader;