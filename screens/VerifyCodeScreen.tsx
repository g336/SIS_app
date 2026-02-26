import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type VerifyCodeNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'VerifyCode'>;

interface Props {
  navigation: VerifyCodeNavigationProp;
}

const VerifyCodeScreen: React.FC<Props> = ({ navigation }) => {
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify code</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your phone number
        </Text>

        <TextInput
          placeholder="Enter verification code"
          placeholderTextColor="#666"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.resendText}>Resend code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyCodeScreen;

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
      marginBottom: 10,
      color: '#243B55',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 13,
      color: '#243B55',
      textAlign: 'center',
      marginBottom: 15,
    },
    input: {
      backgroundColor: '#f2f2f2',
      borderRadius: 15,
      width: '100%',
      padding: 10,
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      letterSpacing: 5,
    },
    button: {
      backgroundColor: '#337ac6',
      borderRadius: 15,
      width: '100%',
      padding: 10,
      alignItems: 'center',
      marginTop: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    resendText: {
      textAlign: 'center',
      marginTop: 15,
      color: '#243B55',
      fontSize: 13,
    },
  });
  