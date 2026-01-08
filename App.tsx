import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';


import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import StudentTabs from './navigation/StudentTabs';
import PYQScreen from './screens/PYQScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeaveRequestScreen from './screens/LeaveRequestScreen';

export type RootStackParamList = {
  Login: undefined;
  StudentTabs: {
    enrollment: string;
  }
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyCode: undefined;
  PYQ: undefined;
  Attendance: undefined; 
  Profile: undefined;
  LeaveRequest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />

        {/* AFTER LOGIN */}
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
        
        {/* NEW SCREENS */}
        <Stack.Screen name="PYQ" component={PYQScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
