import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {engineerloginApi} from '../../store/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import toastFunction from '../../functions/toastFunction';
const EngineerLoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const saveTokenHandler = async token => {
    await AsyncStorage.setItem('aaa_token', token);
  };
  const handleLogin = async () => {
    try {
      const body = {userName: username, password};
      const response = await engineerloginApi(body);

      if (response.data) {
        saveTokenHandler(response?.data?.token);
        console.log(response?.data?.token, 'aaa-token');
        console.log(response?.data);

        navigation.navigate('EngineerTabNavigation');
      } else {
        toastFunction(
          'Login Failed',
          'AAA-SWITCHGEAR',
          'Invalid username or password.',
        );
      }
    } catch (error) {
      console.error(error);
      toastFunction('Login Failed', 'Something went wrong. Please try again.');
    }
  };

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
        style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 40, // Replace with your icon size
    height: 40,
    tintColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#333',
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
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
    bottom: 20,
    fontStyle: 'italic',
  },
});

export default EngineerLoginScreen;
