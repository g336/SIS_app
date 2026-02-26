import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  VerifyCode: { email: string };
  StudentTabs: { enrollment: string }; 
  FacultyTabs: { userId: string };
  AdminDashboard: { userId: string };
};

import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import StudentTabs from './navigation/StudentTabs';
import FacultyHomeScreen from './screens/Facilty_screen/LightMode_HomeScreenF';
import AdminHomeScreen from './screens/Admin_screens/LightMode_HomeScreenA';

// 2. Pass the type to the Stack creator
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />

        {/* Post-Auth Role-Based Navigators */}
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
        <Stack.Screen name="FacultyTabs" component={FacultyHomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}