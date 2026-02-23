import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Menu, ArrowRight, Home, UserCircle } from 'lucide-react-native';

const ViewAttendanceScreen = () => {
  // Simple state to handle button presses if needed later
  const [active, setActive] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Menu color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        
        {/* FACULTY BUTTON - */}
        <TouchableOpacity 
          style={styles.pillButton}
          onPress={() => setActive(1)}
          activeOpacity={0.8}
        >
          <Text style={styles.pillText}>Faculty</Text>
          <ArrowRight color="#FFFFFF" size={24} />
        </TouchableOpacity>

        {/* STUDENT BUTTON - */}
        <TouchableOpacity 
          style={styles.pillButton}
          onPress={() => setActive(2)}
          activeOpacity={0.8}
        >
          <Text style={styles.pillText}>Student</Text>
          <ArrowRight color="#FFFFFF" size={24} />
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation - */}
      <View style={styles.footer}>
        <View style={styles.navBar}>
          <TouchableOpacity>
            <Home color="#4DA8FF" size={28} />
          </TouchableOpacity>
          <TouchableOpacity>
            <UserCircle color="#888888" size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewAttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11121E', // Dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3F4E81', // Blueish header
    gap: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  body: {
    padding: 20,
    gap: 15, // Space between Faculty and Student buttons
  },
  pillButton: {
    backgroundColor: '#4E6299', // Button color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    marginBottom: 10,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#11121E',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E2139', // Dark pill for nav
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
});