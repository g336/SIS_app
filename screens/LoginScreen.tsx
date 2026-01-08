import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { students } from '../data/student';

type LoginScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [enroll, setEnroll] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!enroll.trim()) {
      Alert.alert('Error', 'Please enter enrollment number');
      return;
    }

    const student = students[enroll];

    if (!student) {
      Alert.alert('Error', 'Enrollment not found');
      return;
    }

    // Optional: check password
    if (student.password !== password) {
      Alert.alert('Error', 'Incorrect password');
      return;
    }

    navigation.navigate('StudentTabs', { enrollment: enroll });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome!</Text>

        <TextInput
          placeholder="Enrollment number"
          placeholderTextColor="#4857a3"
          style={styles.input}
          value={enroll}
          onChangeText={setEnroll}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#4857a3"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#243B55',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#b5b5b5',
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
