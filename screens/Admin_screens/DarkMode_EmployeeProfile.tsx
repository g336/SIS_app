import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Menu, ArrowRight, Home, UserCircle } from 'lucide-react-native';

const EmployeeProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header - */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Menu color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          
          {/* Faculty 1 Button - */}
          <TouchableOpacity style={styles.pillButton} activeOpacity={0.7}>
            <Text style={styles.pillText}>Faculty 1</Text>
            <ArrowRight color="#FFFFFF" size={24} />
          </TouchableOpacity>

          {/* Faculty 2 Button - */}
          <TouchableOpacity style={styles.pillButton} activeOpacity={0.7}>
            <Text style={styles.pillText}>Faculty 2</Text>
            <ArrowRight color="#FFFFFF" size={24} />
          </TouchableOpacity>

          {/* Faculty 3 Button - */}
          <TouchableOpacity style={styles.pillButton} activeOpacity={0.7}>
            <Text style={styles.pillText}>Faculty 3</Text>
            <ArrowRight color="#FFFFFF" size={24} />
          </TouchableOpacity>

        </ScrollView>

        {/* Bottom Navigation - */}
        <View style={styles.footer}>
          <View style={styles.navBar}>
            <TouchableOpacity>
              <Home color="#888888" size={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <UserCircle color="#888888" size={28} />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3F4E81', // Header Blue
  },
  container: {
    flex: 1,
    backgroundColor: '#11121E', // Main Dark Background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3F4E81',
    gap: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  body: {
    padding: 20,
    gap: 15,
  },
  pillButton: {
    backgroundColor: '#4E6299', // Button Blue
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 35,
    marginBottom: 5,
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
    backgroundColor: '#1E2139', // Dark Nav Bar
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
});