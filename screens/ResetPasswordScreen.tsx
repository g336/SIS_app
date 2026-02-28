import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import firestore from '@react-native-firebase/firestore';

type ResetNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

interface Props {
  navigation: ResetNavigationProp;
  route: ResetRouteProp;
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params; // The User ID
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }

    setIsLoading(true);
    try {
      // 1. Update the password in Firestore
      // 2. We use FieldValue.delete() to erase the resetCode so it can't be used again!
      await firestore().collection('users').doc(email).update({
        password: newPassword,
        resetCode: firestore.FieldValue.delete(),
        resetCodeTimestamp: firestore.FieldValue.delete()
      });

      setIsLoading(false);
      
      // 3. Success! Reset the navigation stack back to the Login Screen
      Alert.alert('Success! 🎉', 'Your password has been changed successfully.', [
        {
          text: 'Go to Login',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
      ]);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create New Password</Text>

        <TextInput
          placeholder="New Password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Confirm New Password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d9e7f6', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#9ecbff', padding: 25, borderRadius: 20, width: '85%' },
  title: { fontSize: 20, marginBottom: 20, color: '#243B55', textAlign: 'center', fontWeight: 'bold' },
  input: { backgroundColor: '#f2f2f2', borderRadius: 15, width: '100%', padding: 15, marginBottom: 15, color: '#000' },
  button: { backgroundColor: '#337ac6', borderRadius: 15, width: '100%', padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});