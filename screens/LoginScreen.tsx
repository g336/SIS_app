import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import firestore from '@react-native-firebase/firestore';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [enroll, setEnroll] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    const trimmedID = enroll.trim();

    if (!trimmedID) {
      Alert.alert('Error', 'Please enter your ID/Enrollment number');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // 1. Fetching the document using the Clean ID (Enrollment/User ID)
      const userSnap = await firestore()
        .collection('users')
        .doc(trimmedID)
        .get();

      // 2. CORRECTED: Calling .exists() as a function to resolve TS2367
      if (!userSnap.exists()) {
        Alert.alert('Error', 'User ID not found. Ensure you are using a custom ID, not a random string.');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // 3. Verifying the 'password' field you manually added to the document
      if (userData?.password !== password) {
        Alert.alert('Error', 'Incorrect password');
        setLoading(false);
        return;
      }

      const userRole = userData?.role;

      // 4. Role-based navigation with object parameters to satisfy RootStackParamList
      if (userRole === 'student') {
        navigation.replace('StudentTabs', { enrollment: trimmedID }); 
      } else if (userRole === 'faculty') {
        navigation.replace('FacultyTabs', { userId: trimmedID });
      } else if (userRole === 'admin') {
        navigation.replace('AdminDashboard', { userId: trimmedID });
      } else {
        Alert.alert('Error', 'User role not recognized.');
      }

    } catch (error) {
      console.error("Login Error: ", error);
      Alert.alert('Error', 'Connection failed. Ensure Metro is running and your ADB bridge is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#d9e7f6" barStyle="dark-content" />
      <View style={styles.card}>
        <Text style={styles.title}>SIS Login</Text>

        <TextInput
          placeholder="Enrollment / User ID"
          placeholderTextColor="#4857a3"
          style={styles.input}
          value={enroll}
          onChangeText={setEnroll}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#4857a3"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* NEW: Forgot Password Button */}
        <TouchableOpacity 
          style={styles.forgotButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotButtonText}>Forgot Password?</Text>
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
    padding: 30,
    borderRadius: 25,
    width: '85%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: '#243B55',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    width: '100%',
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  button: {
    backgroundColor: '#337ac6',
    borderRadius: 15,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotButtonText: {
    color: '#243B55',
    fontSize: 15,
    fontWeight: '600',
  },
});