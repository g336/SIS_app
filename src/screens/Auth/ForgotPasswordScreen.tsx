import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {
    // Handle sending email logic here
    navigation.navigate('ChangePassword'); // Navigate after sending
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Forget Password</Text>
      <View style={styles.card}>
        <TextInput
          placeholder="Your Email"
          placeholderTextColor="#A0A3A7"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
          <Text style={styles.buttonText}>Send Email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const NEON_GREEN = '#D1FF34';
const BG_COLOR = '#18191A';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backArrow: {
    fontSize: 28,
    color: NEON_GREEN,
  },
  title: {
    fontSize: 28,
    textAlign: 'left',
    fontWeight: 'bold',
    color: NEON_GREEN,
    marginBottom: 30,
    letterSpacing: 0.5,
    textShadowColor: '#01500160',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#222325',
    borderRadius: 28,
    padding: 28,
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
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#EAF1F6',
  },
  button: {
    width: '100%',
    backgroundColor: NEON_GREEN,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BG_COLOR,
    letterSpacing: 1,
  },
  link: {
    color: NEON_GREEN,
    marginTop: 22,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
