import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View style={styles.card}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#828282"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#828282"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const NEON_GREEN = '#D1FF34';  // Neon green used in your UI Kit
const BG_COLOR = '#18191A';   // True dark background

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: NEON_GREEN,
    marginBottom: 40,
    textShadowColor: '#01500160',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  card: {
    width: '90%',
    backgroundColor: '#222325',
    borderRadius: 24,
    padding: 26,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: Platform.OS === 'android' ? 0.31 : 0.21,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#161718',
    color: '#ECECEC',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#28292A',
  },
  button: {
    width: '100%',
    backgroundColor: NEON_GREEN,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    // Neon glow effect
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18191A',
    letterSpacing: 1.2,
    textShadowColor: '#00000033',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  forgot: {
    color: NEON_GREEN,
    marginTop: 22,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
    letterSpacing: 1,
  },
});
