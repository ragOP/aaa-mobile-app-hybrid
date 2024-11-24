import React, { useEffect } from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.getItem("aaa_token").then((value) =>
        navigation.replace(
          value === null ? "AuthNavigation" : "BottomTabNavigation"
        )
      );
    }, 3000);
  }, []);
  const handleSelection = () => {
    navigation.navigate('AuthNavigation');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.subtitle}>Site Service App</Text>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.button}
       >
        <Image
          source={require('../../assets/icons/arrow.png')}
          style={styles.logoIcon}
        />
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
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 26,
    color: '#555',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF0000',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    marginBottom: 30,
  },
  logoIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
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

export default SplashScreen;
