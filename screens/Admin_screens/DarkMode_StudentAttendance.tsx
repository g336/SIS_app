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
  // 0 = none, 1 = Department open, 2 = Semester open
  const [openDropdown, setOpenDropdown] = useState(0);

  const toggleDropdown = (id) => {
    // If the same one is clicked, close it (0), otherwise open the new one
    setOpenDropdown(openDropdown === id ? 0 : id);
  };

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
          
          {/* SELECT DEPARTMENT DROPDOWN */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => toggleDropdown(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Select Department</Text>
              {openDropdown === 1 ? (
                <ArrowUp color="#FFFFFF" size={24} /> 
              ) : (
                <ArrowDown color="#FFFFFF" size={24} />
              )}
            </TouchableOpacity>

            {openDropdown === 1 && (
              <View style={styles.dropdownContent}>
                <Text style={styles.placeholderText}>List of Departments...</Text>
              </View>
            )}
          </View>

          {/* SELECT SEMESTER DROPDOWN - */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => toggleDropdown(2)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Select Semester</Text>
              {openDropdown === 2 ? (
                <ArrowUp color="#FFFFFF" size={24} /> 
              ) : (
                <ArrowDown color="#FFFFFF" size={24} />
              )}
            </TouchableOpacity>

            {openDropdown === 2 && (
              <View style={styles.dropdownContent}>
                <Text style={styles.placeholderText}>List of Semesters...</Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* View Button - */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#3F4E81',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#11121E',
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
    gap: 20,
  },
  section: {
    width: '100%',
  },
  pill: {
    backgroundColor: '#4E6299',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    zIndex: 10,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  dropdownContent: {
    backgroundColor: '#1E2139',
    marginTop: -25, 
    paddingTop: 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 180,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#4E6299',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#11121E',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E2139',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
});