import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {engineerloginApi} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toastFunction from '../../functions/toastFunction';

const EngineerLoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // New state for loader
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // New state for button

  const saveTokenHandler = async token => {
    await AsyncStorage.setItem('aaa_token', token);
  };

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const body = {userName: username, password};
      const response = await engineerloginApi(body);
      const token = response?.data?.data?.token;
      const user = response?.data?.data?.user;

      if (response?.data) {
        await AsyncStorage.setItem('aaa_token', token);
        await AsyncStorage.setItem('aaa_user', JSON.stringify(user));
        await AsyncStorage.setItem('aaa_user_type', 'engineer');
        navigation.navigate('EngineerTabNavigation');
      } else {
        // toastFunction(
        //   'Login Failed',
        //   'AAA-SWITCHGEAR',
        //   'Invalid username or password.',
        // );
        Alert.alert('Login failed', 'Please enter correct credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login failed', 'Please enter correct credentials');
      toastFunction('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Hide loader when login ends
    }
  };

  useEffect(() => {
    // Check if both username and password are empty
    if (username === '' || password === '') {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [username, password]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/icons/Smartphone.png')}
            style={styles.logoIcon}
          />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Engineer Login</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Enter Your Username & Password</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
        secureTextEntry={true}
      />

      <TouchableOpacity
        onPress={handleLogin}
        activeOpacity={1}
        style={[styles.submitButton, isButtonDisabled && styles.disabledButton]} // Apply disabled style
        disabled={isButtonDisabled || loading} // Disable button if either isButtonDisabled or loading is true
      >
        {/* Show loader when logging in, otherwise show the submit text */}
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1}>
        <Text style={styles.forgotPasswordText}>Forget Password ?</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        A Product of AAA SWITCH GEAR PVT LTD{'\n'}All Rights Reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    backgroundColor: '#FF0000',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  logoIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '83%',
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#333',
    width: '83%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 25,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    position: 'absolute',
    bottom: '1%',
    fontStyle: 'italic',
  },
});

export default EngineerLoginScreen;
