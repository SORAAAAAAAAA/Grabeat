import React from 'react';
import { View, Text, StyleSheet, Button, TextInput, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MainPage = () => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Good Morning, <Text style={{ color: '#E95322' }}>Have a good day!</Text></Text>
            </View>
                <View style={styles.searchBarContainer}>
                    <TextInput placeholderTextColor="#32343E" style={styles.searchBar} placeholder='Search dishes, restaurants'></TextInput>
                    <Icon name="search-outline" size={25} color="#1C274C"/>
                    <Icon name="mic-outline" size={25} color="#1C274C"/>
                </View>

            <View style={styles.imageContainer}>
                
                <Image style={styles.img} source={require('../../assets/images/image _rowM.png')}></Image>
                <Image style={styles.img}  source={require('../../assets/images/image _rowM2.png')}></Image>
                <Image style={styles.img}  source={require('../../assets/images/image _rowM3.png')}></Image>
                <Image style={styles.img} source={require('../../assets/images/image _rowM4.png')}></Image>
            
            </View>

            <View style={styles.descrContainer}>
                <Text style={styles.txt} >Non Veg</Text>
                <Text style={styles.txt} >Veg</Text>
                <Text style={styles.txt} >Spicy</Text>
                <Text style={styles.txt} >Pizza</Text>
            </View>

            <View style={styles.movContainer}>
                <ScrollView horizontal={true} style={styles.scrollContainer} showsHorizontalScrollIndicator={false} pagingEnabled={false}>
                <View>
                    <Image style={styles.imgM} source={require('../../assets/images/5.png')} />
                </View>
                <View >
                    <Image style={styles.imgM} source={require('../../assets/images/5.png')} />
                </View>
                <View>
                    <Image style={styles.imgM} source={require('../../assets/images/4.png')} />
                </View>
                <View >
                    <Image style={styles.imgM} source={require('../../assets/images/4.png')} />
                </View>
                <View>
                    <Image style={styles.imgM} source={require('../../assets/images/5.png')}></Image>
                </View>
                
                </ScrollView>
            </View>

            <View style={styles.imageContainerB}>
                <Image style={styles.imgB} source={require('../../assets/images/hor_img.png')} />
            </View>


            
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#FFFFFF',
    },
    titleContainer: {
      marginBottom: 20,
      alignSelf: 'flex-start',
      marginLeft: 10,
    },
    title: {
      fontSize: 24,
   
    },
    searchBarContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFCB11',
      paddingHorizontal: 10,
      borderRadius: 15,
      marginBottom: 20,
    },
    searchBar: {
      flex: 1,
      height: 50,
      fontSize: 16,
      paddingHorizontal: 10,
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      padding: 10,
      marginBottom: 20,
    },
    img: {
      width: 55,
      height: 55,
      borderRadius: 10,
    },
    descrContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    txt: {
      fontSize: 20,
      fontFamily: 'Poppins-Regular',
    },
    movContainer: {
      width: '100%',
      marginBottom: 20,
    },
    scrollContainer: {
      paddingHorizontal: 10,
    },
    imgM: {
      width: 160, 
      height: 150, 
      borderRadius: 10,
      marginHorizontal: 5,
    },
    imageContainerB:{
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 15,
       
    },
    imgB: {
        height: 160,
        width: 340,
        borderRadius: 15
    }
  });
export default MainPage;