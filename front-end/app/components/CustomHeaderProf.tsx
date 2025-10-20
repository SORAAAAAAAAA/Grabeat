import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';


const CustomHeaderProf: React.FC<{ title: string; navigation: any }> = ({ title, navigation }) => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.cont1}>
          <FontAwesome style={styles.con} name="caret-left" size={25} color="#000000"/>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View>
        <Entypo name="dots-three-horizontal" size={25} color="#000000"/>
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
        paddingHorizontal: 35,
        
   
      },
      title: {
        fontFamily: 'Poppin-Regular',
        fontSize: 25,
        paddingLeft: 17
        
      },
      cont1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
  
        
        
      },
      con: {
   
      }
      
    
})



export default CustomHeaderProf;