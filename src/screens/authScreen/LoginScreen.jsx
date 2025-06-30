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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {customerloginApi} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPasswordModal from './components/ForgotPasswordModal';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(!showModal);
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const body = {userName: username, password};
      const response = await customerloginApi(body);

      const token = response?.data?.data?.token;
      const user = response?.data?.data?.user;
      if (response?.data?.success) {
        await AsyncStorage.setItem('aaa_token', token);
        await AsyncStorage.setItem('aaa_user_type', 'customer');
        await AsyncStorage.setItem('aaa_user', JSON.stringify(user));
        navigation.navigate('BottomTabNavigation');
      } else {
        Alert.alert('Login failed', response?.data?.data?.message);
      }
    } catch (error) {
      Alert.alert(
        'Login failed',
        error?.message || 'Server issue, try again later.',
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (username === '' || password === '') {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [username, password]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
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
          <Text style={styles.title}>Customer Login</Text>

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
            style={[
              styles.submitButton,
              isButtonDisabled && styles.disabledButton,
            ]}
            disabled={isButtonDisabled || loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1}>
            <Text style={styles.forgotPasswordText} onPress={handleOpenModal}>
              Forget Password?
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            A Product of AAA SWITCH GEAR PVT LTD{'\n'}All Rights Reserved.
          </Text>
          {showModal && (
            <ForgotPasswordModal
              showModal={showModal}
              setShowModal={setShowModal}
              userType="customer"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
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
    marginLeft: -170,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10, // Use a fixed value for better safe area support
    fontStyle: 'italic',
  },
});

export default LoginScreen;
