import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/constants';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import EngineerHomeScreen from '../screens/EngineerHomeScreen/EngineerHomeScreen';
import AllJobsScreen from '../screens/AllJobsScreen/AllJobScreen';
import PaperText from '../ui/PaperText';
import JobDetailScreen from '../screens/JobDetailScreen/JobDetailScreen';

const Tab = createBottomTabNavigator();

const tabConfig = {
  EngineerHomeScreen: {
    component: EngineerHomeScreen,
    icon: {
      active: require('../assets/icons/home.png'),
      inactive: require('../assets/icons/home_outline.png'),
    },
    text: 'Home',
  },
  AllJobsScreen: {
    component: AllJobsScreen,
    icon: {
      active: require('../assets/icons/invoice_active.png'),
      inactive: require('../assets/icons/invoice.png'),
    },
    text: 'All Jobs',
  },
  ProfileScreen: {
    component: ProfileScreen,
    icon: {
      active: require('../assets/icons/profile.png'),
      inactive: require('../assets/icons/profile_outline.png'),
    },
    text: 'Profile',
  },
};

const getTabBarIcon =
  (icon, text) =>
  ({focused}) =>
    (
      <View
        style={
          focused ? styles.tabItemContainerActive : styles.tabItemContainer
        }>
        <Image
          style={styles.icon}
          source={focused ? icon.active : icon.inactive}
        />
        <PaperText
          text={text}
          variant="titleSmall"
          fontStyling={focused ? styles.activeTabText : styles.tabText}
        />
      </View>
    );

const EngineerBottomNavigation = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {height: '8%'},
      tabBarHideOnKeyboard: true,
    }}
    initialRouteName="EngineerHomeScreen">
    {Object.entries(tabConfig).map(([name, {component, icon, text}]) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{
          tabBarIcon: getTabBarIcon(icon, text),
        }}
      />
    ))}
  </Tab.Navigator>
);

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
  activeTabText: {
    color: 'rgba(0, 0, 0, 1)',
  },
  tabText: {
    color: 'rgba(162, 162, 162, 1)',
    marginTop: 2,
  },
});

export default EngineerBottomNavigation;
