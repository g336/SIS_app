import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [enroll, setEnroll] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome!</Text>

        <TextInput
          placeholder="Enter your Enrollment number"
          placeholderTextColor="#666"
          style={styles.input}
          value={enroll}
          onChangeText={setEnroll}
        />

        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

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
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#243B55',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    width: '100%',
    padding: 10,
    marginBottom: 12,
  },
  forgotText: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    color: '#243B55',
    fontSize: 13,
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
