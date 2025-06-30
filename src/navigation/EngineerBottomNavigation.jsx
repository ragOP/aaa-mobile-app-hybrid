import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import {colors} from '../utils/constants';
import EngineerHomeScreen from '../screens/EngineerHomeScreen/EngineerHomeScreen';
import AllJobsScreen from '../screens/AllJobsScreen/AllJobScreen';
import PaperText from '../ui/PaperText';
import EngineerProfileScreen from '../screens/EngineerProfileScreen/EngineerProfileScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const tabConfig = {
  EngineerHomeScreen: {
    component: EngineerHomeScreen,
    icon: 'home',
    text: 'Home',
  },
  AllJobsScreen: {
    component: AllJobsScreen,
    icon: 'work',
    text: 'All Jobs',
  },
  EngineerProfileScreen: {
    component: EngineerProfileScreen,
    icon: 'person',
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
        <Icon name={icon} size={24} color={focused ? '#fa2929' : colors.gray} />
        <PaperText
          text={text}
          variant="titleSmall"
          fontStyling={focused ? styles.activeTabText : styles.tabText}
        />
      </View>
    );

const EngineerBottomNavigation = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
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
    borderColor: '#fa6b6b',
  },
  activeTabText: {
    color: '#fa2929',
  },
  tabText: {
    color: 'rgba(162, 162, 162, 1)',
    marginTop: 2,
  },
});

export default EngineerBottomNavigation;
