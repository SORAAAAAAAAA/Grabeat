import {StyleSheet ,Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, View, Image } from 'react-native';
import React, { useState } from 'react';
import CheckBox from "expo-checkbox";
import styLS from '@/app/design/stylLS';

interface LogSignProps {
    setIsLogged: (isLogged: boolean) => void;
}

const LogSign: React.FC<LogSignProps> = ({ setIsLogged }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [isChecked, setIsChecked] = useState(false); // State for checkbox
    const API_URL = "http://localhost:3000"; 

    const handleRegister = async () => {
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
                alert(`Success: ${data.message}`);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Error: Unable to register user`);
        }
    };

    const handleLogin = async () => {
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
                alert(`Success: ${data.message}`);
                setIsLogged(true); // Set isLogged to true after successful login
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Error: Unable to login user`);
        }
    };

    const handleToggle = () => {
        setIsSignUp(!isSignUp);
        setEmail('');
        setPassword('');
    };

    return (
        <KeyboardAvoidingView style={styLS.background} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={styLS.title}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>

            {isSignUp && (
                <>
                    <TextInput
                        style={styLS.input}
                        placeholder="Full Name"
                        placeholderTextColor="#aaa"
                        value={fullName}
                        onChangeText={setFullName}
                        keyboardType="default"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styLS.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#aaa"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="numeric"
                    />
                </>
            )}

            <TextInput
                style={styLS.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styLS.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {isSignUp && (
                <TextInput
                    style={styLS.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#aaa"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            )}

            {!isSignUp && (
              <View style={styles.cont}>
              <View style={styles.cont2}>
                <CheckBox
                      value={isChecked}
                      onValueChange={setIsChecked}
                  />
                  <Text style={{ marginLeft: 8 }}>Remember Me</Text>
              </View>

              <TouchableOpacity>
                <Text>Forgot Password?</Text>
              </TouchableOpacity>
              
            </View>
            )}
            
    
            <TouchableOpacity
                style={styLS.button}
                onPress={isSignUp ? handleRegister : handleLogin}
            >
                <Text style={styLS.buttonText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', padding: 15, justifyContent: 'space-evenly'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={{fontSize: 16}}>
                      {isSignUp ?  'Already have an account?' : 'Don’t have an account?'}{'   '}
                      <Text onPress={handleToggle} style={styLS.toggleText}>{isSignUp ?  'Log In' : 'Sign Up'}</Text>
                  </Text>
              </View>
              
            </View>
  
            <View style={styles.cont3}>
              <View style={styles.line} />
              <Text style={styles.opt}>{isSignUp ? 'Or Login with' : 'Or Sign up with'}</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.cont4}>
              <TouchableOpacity>
                  <Image style={styles.imgs} source={require('@/assets/images/Facebook.png')} />
              </TouchableOpacity>

              <TouchableOpacity>
                  <Image style={styles.imgs} source={require('@/assets/images/Google.png')} />
              </TouchableOpacity>
            </View>

            {isSignUp && (
                <View style={styles.agreementContainer}>
                    <Text  style={styles.agreementText}>
                        By signing up you agree with our{' '}
                            <Text  style={styles.linkText}>Terms of Use</Text>
                      {' '}
                        and{' '}
                            <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
  cont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 25
  },
  cont2: {
    flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 140
  },
  cont3:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  cont4: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    
  },
  agreementContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  imgs:{
    margin: 12
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    flex: 1, 
},
opt: {
  fontSize: 18,
  fontFamily: 'Poppins-Regular',
  fontWeight: 'normal',
  paddingLeft: 10,
  paddingRight: 10
},
linkText: {
  color: '#FFC42E',
  flexDirection: 'row',
  
},
agreementText: {
  textAlign: 'center',
  
}
});

export default LogSign; 