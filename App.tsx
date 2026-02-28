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
import FacultyHomeScreen from './screens/Facilty_screen/FacultyMasterClass';
import Admin_side from './screens/Admin_screens/AdminMasterClass';

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
        
        {/* FIX 2: Renamed the screen name to AdminDashboard */}
        <Stack.Screen name="AdminDashboard" component={Admin_side} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}