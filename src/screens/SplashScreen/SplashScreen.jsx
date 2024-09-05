import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('AuthNavigation');
    }, 5000);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>
      <View style={styles.circle3}></View>

      <View style={styles.topSection}>
        <Text style={styles.brandName}>AAA - SWITCHGEAR</Text>
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
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
    paddingLeft: 25,
  },

  subtitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#7D5FFE',
    marginBottom: 10,
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
    width: height * 0.3,
    height: height * 0.3,
    borderRadius: height * 0.175,
    backgroundColor: '#aa98fe',
    top: height * 0.3,
    left: width * 0.05,
  },
  circle3: {
    position: 'absolute',
    width: height * 0.16,
    height: height * 0.16,
    borderRadius: height * 0.125,
    backgroundColor: '#aa98fe',
    bottom: height * 0.03,
    right: width * 0.03,
  },
});

export default SplashScreen;
