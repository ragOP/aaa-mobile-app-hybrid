import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login clicked');
    navigation.navigate("BottomTabNavigation" );
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>

      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandName}>AAA - SWITCHGEAR</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.subtitle}>Login to your account</Text>
        
        {/* Email Input Field */}
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          style={styles.input}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          outlineStyle={{ borderRadius: 12 }}
        />
        
        {/* Password Input Field */}
        <TextInput
          label="Password"
          value={password}
          mode="outlined"
          style={styles.input}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          outlineStyle={{ borderRadius: 12 }}
         
        />
        
        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Login
        </Button>

        <Text style={styles.footerText}>
          Don't have an account? 
          <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7D5FFE',
    paddingVertical: 20,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 38,
    color: '#FFFFFF',
    fontWeight: '600',
    paddingLeft: 25,
  },
  brandName: {
    fontSize: 35,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
    paddingLeft: 25,
  },
  bottomSection: {
    flex: 1.5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    position: 'relative',
    top: 30,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#7D5FFE',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    width: '90%',
  },
  button: {
    width: "90%",
    alignSelf: "center",
    height: 55,
    backgroundColor: '#7D5FFE',
    alignItems: "center",
    justifyContent: "center",
    borderRadius:20,
    marginTop: 18,

  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    color: '#7D5FFE',
    fontWeight: 'bold',
  },
  circle1: {
    position: 'absolute',
    width: height * 0.16,
    height: height * 0.16,
    borderRadius: height * 0.125,
    backgroundColor: '#aa98fe',
    top: height * 0.01,
    right: width * 0.03,
  },
  circle2: {
    position: 'absolute',
    width: height * 0.30,
    height: height * 0.30,
    borderRadius: height * 0.175,
    backgroundColor: '#aa98fe',
    top: height * 0.3,
    left: width * 0.05,
  },
});

export default LoginScreen;
 