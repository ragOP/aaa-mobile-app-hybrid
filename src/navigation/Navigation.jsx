import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigation/AuthNavigation';
import BottomNavigation from './BottomNavigation';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import EngineerBottomNavigation from './EngineerBottomNavigation';
import ComplainDetailScreen from '../screens/ComplainDetailScreen/ComplainDetailScreen';
import ViewMoreComplaints from '../screens/ViewMoreComplaints/ViewMoreComplaints';
import NewComplaintScreen from '../screens/NewComplaintScreen/NewComplaintScreen';
import ComplaintScreen from '../screens/ComplaintScreen/ComplaintScreen';
import AllJobsScreen from '../screens/AllJobsScreen/AllJobScreen';
import JobDetailScreen from '../screens/JobDetailScreen/JobDetailScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="SplashScreen">
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
            <Stack.Screen name="ComplaintScreen" component={ComplaintScreen} />

            <Stack.Screen name="AllJobScreen" component={AllJobsScreen} />
            <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
