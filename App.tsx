import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import SignInScreen from "./screens/SignInScreen"
import UserRegistrationScreen from "./screens/UserRegistrationScreen"
import OwnerRegistrationScreen from "./screens/OwnerRegistrationScreen"
import AdminRegistrationScreen from "./screens/AdminRegistrationScreen"
import UserHomeScreen from "./screens/UserHomeScreen"
import OwnerHomeScreen from "./screens/OwnerHomeScreen"
import AdminHomeScreen from "./screens/AdminHomeScreen"
import VenueDetailScreen from "./screens/VenueDetailScreen"
import {StatusBar} from "react-native";

const Stack = createStackNavigator();



export default function App() {
  return (
      <>
          <StatusBar style="light" backgroundColor="#000000" />
          <NavigationContainer>
              <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="SignIn" component={SignInScreen} />
                  <Stack.Screen name="UserRegistration" component={UserRegistrationScreen} />
                  <Stack.Screen name="OwnerRegistration" component={OwnerRegistrationScreen} />
                  <Stack.Screen name="AdminRegistration" component={AdminRegistrationScreen} />
                  <Stack.Screen name="UserHome" component={UserHomeScreen} />
                  <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
                  <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
                  <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
              </Stack.Navigator>
          </NavigationContainer>
      </>
  );
}
