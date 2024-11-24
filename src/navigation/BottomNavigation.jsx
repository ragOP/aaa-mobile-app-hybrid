import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, View} from 'react-native';
import {colors, defaultStyles} from '../utils/constants';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import PaperText from '../ui/PaperText';
import ComplaintScreen from '../screens/ComplaintScreen/ComplaintScreen';
import ProjectScreen from '../screens/ProjectScreen/ProjectScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
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
        name="HomeScreen"
        component={HomeScreen}
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
        name="ComplaintScreen"
        component={ComplaintScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.tabItemContainerActive}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/invoice.png')}
                />
                <PaperText
                  text="Complaints"
                  variant="titleSmall"
                  fontStyling={styles.tabText}
                />
              </View>
            ) : (
              <View style={styles.tabItemContainer}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/invoice.png')}
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
        name="ProjectScreen"
        component={ProjectScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <View style={styles.tabItemContainerActive}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/invoice.png')}
                />
                <PaperText
                  text="My Projects"
                  variant="titleSmall"
                  fontStyling={styles.tabText}
                />
              </View>
            ) : (
              <View style={styles.tabItemContainer}>
                <Image
                  style={styles.icon}
                  source={require('../assets/icons/invoice.png')}
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
                  source={require('../assets/icons/invoice.png')}
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
    borderColor: 'red',
  },
  tabText: {
    color: 'black',
    marginTop: 2,
  },
});
export default BottomTabNavigation;
