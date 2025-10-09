import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ResetPassword'
>;

interface Props {
  navigation: ResetPasswordScreenNavigationProp;
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot password</Text>

        <TextInput
          placeholder="New password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={newPass}
          onChangeText={setNewPass}
        />

        <TextInput
          placeholder="Confirm new password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={confirmPass}
          onChangeText={setConfirmPass}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Go to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e7f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#5899e2',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    width: '100%',
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#337ac6',
    borderRadius: 15,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
