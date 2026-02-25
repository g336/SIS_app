import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Menu, ArrowDown, ArrowUp, Home, UserCircle } from 'lucide-react-native';

const StudentAttendanceScreen = () => {
  // Boolean state: true = open, false = closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        
        {/* Header - */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Menu color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Attendance</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          
          {/* ONLY ATTENDANCE DROPDOWN - */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => setIsOpen(!isOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Attendance</Text>
              {isOpen ? (
                <ArrowUp color="#FFFFFF" size={24} /> 
              ) : (
                <ArrowDown color="#FFFFFF" size={24} />
              )}
            </TouchableOpacity>

            {/* Dropdown Content - */}
            {isOpen && (
              <View style={styles.dropdownContent}>
                <Text style={styles.placeholderText}>
                  Attendance details will appear here.
                </Text>
              </View>
            )}
          </View>

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

export default StudentAttendanceScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3F4E81', // Blue header background
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#11121E', // Dark screen background
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
    fontSize: 18,
    fontWeight: '500',
  },
  body: {
    padding: 20,
    paddingTop: 30,
  },
  section: {
    width: '100%',
  },
  pill: {
    backgroundColor: '#4E6299', // Pill blue color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    zIndex: 10, // Ensures it stays on top of the dropdown
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  dropdownContent: {
    backgroundColor: '#1E2139', // Dark card color
    marginTop: -25, // Slide under effect
    paddingTop: 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 200,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#11121E',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E2139', // Bottom nav bar color
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
});