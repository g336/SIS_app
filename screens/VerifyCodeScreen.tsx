import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import firestore from '@react-native-firebase/firestore';

type VerifyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyCode'>;
type VerifyRouteProp = RouteProp<RootStackParamList, 'VerifyCode'>;

interface Props {
  navigation: VerifyNavigationProp;
  route: VerifyRouteProp;
}

const VerifyCodeScreen: React.FC<Props> = ({ navigation, route }) => {
  // 'email' here is actually the User ID passed from ForgotPasswordScreen
  const { email } = route.params; 
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      return Alert.alert('Error', 'Please enter the 4-digit verification code.');
    }

    setIsLoading(true);
    try {
      // 1. Fetch the user's document from Firestore
      const userDoc = await firestore().collection('users').doc(email).get();
      
      if (!userDoc.exists) {
        setIsLoading(false);
        return Alert.alert('Error', 'User not found.');
      }

      const userData = userDoc.data();
      
      // 2. Check if the code they typed matches the one saved in Firestore
      if (userData?.resetCode === code) {
        setIsLoading(false);
        // 3. If it matches, let them reset the password!
        navigation.navigate('ResetPassword', { email: email });
      } else {
        setIsLoading(false);
        Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>Enter the 4-digit code sent for: {email}</Text>

        <TextInput
          placeholder="Enter 4-digit code"
          placeholderTextColor="#666"
          style={styles.input}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyCodeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d9e7f6', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#9ecbff', padding: 25, borderRadius: 20, width: '80%' },
  title: { fontSize: 20, marginBottom: 10, color: '#243B55', textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 20, color: '#243B55', textAlign: 'center' },
  input: { backgroundColor: '#f2f2f2', borderRadius: 15, width: '100%', padding: 15, marginBottom: 15, color: '#000', textAlign: 'center', fontSize: 20, letterSpacing: 5 },
  button: { backgroundColor: '#337ac6', borderRadius: 15, width: '100%', padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});