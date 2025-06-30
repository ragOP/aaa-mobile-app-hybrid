import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View, Platform} from 'react-native';
import {colors} from '../utils/constants';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ComplaintScreen from '../screens/ComplaintScreen/ComplaintScreen';
import ProjectScreen from '../screens/ProjectScreen/ProjectScreen';
import PaperText from '../ui/PaperText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const tabConfig = {
  HomeScreen: {
    component: HomeScreen,
    icon: 'home',
    text: 'Home',
  },
  ComplaintScreen: {
    component: ComplaintScreen,
    icon: 'description',
    text: 'Complaints',
  },
  ProjectScreen: {
    component: ProjectScreen,
    icon: 'work',
    text: 'My Projects',
  },
  ProfileScreen: {
    component: ProfileScreen,
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

const BottomTabNavigation = () => {
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
          height: 60 + insets.bottom, // Dynamic height for all devices
          paddingBottom: insets.bottom, // Dynamic safe area for all devices
        },
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="HomeScreen">
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

export default BottomTabNavigation;
