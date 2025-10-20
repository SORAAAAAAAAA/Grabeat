import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Profile = () => {
  

    return (
        <View style={styles.container}>
            <View>
                <Image source={require('../../assets/images/bunny.png')} />
               
            </View>
            <View style={styles.containerBox}>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <Ionicons name="person-circle-outline" size={27} color="#000" />
                        <Text style={styles.title}>Personal Info</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <FontAwesome6 name="map-location-dot" size={20} color="#000" />
                        <Text style={styles.title}>Addresses</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <MaterialIcons name="my-location" size={25} color="#000" />
                        <Text style={styles.title}>Order Tracking</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
            </View>

            <View style={styles.containerBox}>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <FontAwesome5 name="cart-plus" size={20} color="#000" />
                        <Text style={styles.title}>Cart</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <Entypo name="heart" size={25} color="#000" />
                        <Text style={styles.title}>Favourites</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <Ionicons name="notifications" size={25} color="#000" />
                        <Text style={styles.title}>Notifications</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <MaterialIcons name="payments" size={25} color="#000" />
                        <Text style={styles.title}>Payment Method</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
            </View>

            <View style={styles.containerBox}>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <FontAwesome5 name="cart-plus" size={20} color="#000" />
                        <Text style={styles.title}>FAQs</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <Entypo name="heart" size={25} color="#000" />
                        <Text style={styles.title}>User Reviews</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <Ionicons name="notifications" size={25} color="#000" />
                        <Text style={styles.title}>Settings</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
                <View style={styles.containerItem}>
                    <View style={styles.containerPair}>
                        <MaterialIcons name="payments" size={25} color="#000" />
                        <Text style={styles.title}>Rate Us</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={17} color="#000" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 10
    },
    containerBox: {
       backgroundColor: '#f5f5f5',
       borderRadius: 15,
       width: '80%',
       padding: 20,
       marginBottom: 20,
       paddingTop: 0,
       paddingBottom: 0
    },
    containerItem: {
       flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    containerPair: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 70
    },
    title: {
        fontSize: 25,
        paddingLeft: 20,
        fontFamily: 'Poppins-Regular',
    },
});

export default Profile;