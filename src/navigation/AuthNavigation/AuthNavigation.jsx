import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/authScreen/LoginScreen";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
