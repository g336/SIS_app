import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import firestore from '@react-native-firebase/firestore';

type ForgotNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      return Alert.alert("Error", "Please enter your ID (Enrollment No. or Username).");
    }

    setIsLoading(true);
    const userId = email.trim(); // Cleans up any accidental spaces

    try {
      // 1. Search the 'users' collection exactly like your LoginScreen does
      const userDocRef = firestore().collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      // 2. Safely check if the user exists (handles both Firebase versions)
      const userExists = typeof userDoc.exists === 'function' ? userDoc.exists() : userDoc.exists;

      // 3. If account doesn't exist, stop.
      if (!userExists) {
        setIsLoading(false);
        return Alert.alert("Not Found", "No account found with this ID.");
      }

      // 4. Generate a random 4-digit code
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

      // 5. Save the secret code to their Firestore document
      await userDocRef.update({
        resetCode: generatedCode,
        resetCodeTimestamp: firestore.FieldValue.serverTimestamp()
      });

      setIsLoading(false);

      // 6. Simulate the Email being sent, then navigate!
      Alert.alert(
        "Code Generated! 📧", 
        `For testing purposes, imagine you received an email.\n\nYour reset code is: ${generatedCode}`,
        [
          { 
            text: "Go to Verification", 
            onPress: () => navigation.navigate('VerifyCode', { email: userId }) 
          }
        ]
      );

    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot password</Text>

        <TextInput
          placeholder="Enter your ID (e.g. Nevil or 20230...)"
          placeholderTextColor="#666"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e7f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#9ecbff',
    padding: 25,
    borderRadius: 20,
    width: '80%',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#243B55',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    width: '100%',
    padding: 15,
    marginBottom: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#337ac6',
    borderRadius: 15,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});