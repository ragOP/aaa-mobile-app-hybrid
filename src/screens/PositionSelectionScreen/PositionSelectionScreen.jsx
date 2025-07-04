import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PositionSelectionScreen = ({navigation}) => {
  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleEngineerLogin = () => {
    navigation.navigate('EngineerLoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Select Your Position</Text>
      <Text style={styles.subtitle}>We look forward to servidsng you.</Text>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.customerButton}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.engineerButton}
        onPress={handleEngineerLogin}>
        <Text style={styles.engineerButtonText}>Service Engineer</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          A Product of AAA SWITCH GEAR PVT LTD{'\n'}All Rights Reserved.
        </Text>

        <View style={styles.madeWithLoveFooter}>
          <Text style={styles.madeWithLoveTextWithMargin}>
            MADE WITH LOVE BY NAJCODE
          </Text>
          <MaterialIcons name="favorite" size={14} color="#FF0000" />
        </View>
      </View>
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
    marginBottom: 30,
  },
  customerButton: {
    backgroundColor: '#FF0000',
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  engineerButton: {
    backgroundColor: '#333',
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  engineerButtonText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    height: 1,
    width: 135,
    backgroundColor: '#333',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  madeWithLoveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  madeWithLoveTextWithMargin: {
    fontSize: 12,
    color: '#555',
    marginRight: 4,
    paddingTop: 4,
    marginBottom: 6,
  },
});

export default PositionSelectionScreen;
