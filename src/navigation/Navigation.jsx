import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigation/AuthNavigation';
import BottomNavigation from './BottomNavigation';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import EngineerBottomNavigation from './EngineerBottomNavigation';
import ComplainDetailScreen from '../screens/ComplainDetailScreen/ComplainDetailScreen';
import ViewMoreComplaints from '../screens/ViewMoreComplaints/ViewMoreComplaints';
import NewComplaintScreen from '../screens/NewComplaintScreen/NewComplaintScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SplashScreen"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomNavigation}
        />
         <Stack.Screen
          name="EngineerTabNavigation"
          component={EngineerBottomNavigation}
        />
         <Stack.Screen
          name="ComplainDetailScreen"
          component={ComplainDetailScreen}
        />
        <Stack.Screen
          name="ViewMoreComplaints"
          component={ViewMoreComplaints}
        />
         <Stack.Screen
          name="NewComplaintScreen"
          component={NewComplaintScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;