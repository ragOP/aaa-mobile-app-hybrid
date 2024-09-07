import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/authScreen/LoginScreen";
import PositionSelectionScreen from "../../screens/PositionSelectionScreen";
import EngineerLoginScreen from "../../screens/authScreen/EngineerLoginScreen";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="PositionSelectionScreen">
    
      <Stack.Screen
        name="PositionSelectionScreen"
        component={PositionSelectionScreen}
      />
        <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
      />
        <Stack.Screen
        name="EngineerLoginScreen"
        component={EngineerLoginScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
