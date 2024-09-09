import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, View} from 'react-native';
import {colors, defaultStyles} from '../utils/constants';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import PaperText from '../ui/PaperText';
import EngineerHomeScreen from '../screens/EngineerHomeScreen/EngineerHomeScreen';

const Tab = createBottomTabNavigator();

const EngineerBottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {height: '8%'},
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="HomeScreen">
      <Tab.Screen
        name="EngineerHomeScreen"
        component={EngineerHomeScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.tabItemContainerActive}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/home.png')}
                />
                <PaperText
                  text="Home"
                  variant="titleSmall"
                  fontStyling={styles.tabText}
                />
              </View>
            ) : (
              <View style={styles.tabItemContainer}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/home_outline.png')}
                />
                <PaperText
                  text=""
                  variant="titleSmall"
                  fontStyling={styles.tabText}
                />
              </View>
            ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.tabItemContainerActive}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/profile.png')}
                />
                <PaperText
                  text="Profile"
                  variant="titleSmall"
                  fontStyling={styles.tabText}
                />
              </View>
            ) : (
              <View style={styles.tabItemContainer}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/profile_outline.png')}
                />
                <PaperText
                  text=""
                  variant="titleSmall"
                  fontStyling={styles.tabText}
                />
              </View>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  tabItemContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderColor: colors.white,
  },
  tabItemContainerActive: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.primary,
    marginTop: 2,
  },
});
export default EngineerBottomNavigation;
