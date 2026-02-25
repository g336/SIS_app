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

const FacultyAttendanceScreen = () => {
  // 0: none, 1: Dept, 2: Sem, 3: Faculty
  const [openSection, setOpenSection] = useState(0);

  const toggleDropdown = (id) => {
    setOpenSection(openSection === id ? 0 : id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header - */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Menu color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Faculty Attendance</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          
          {/* 1. SELECT DEPARTMENT - */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => toggleDropdown(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Select Department</Text>
              {openSection === 1 ? <ArrowUp color="#FFF" /> : <ArrowDown color="#FFF" />}
            </TouchableOpacity>
            {openSection === 1 && (
              <View style={styles.dropdown}>
                <Text style={styles.listText}>Department options...</Text>
              </View>
            )}
          </View>

          {/* 2. SELECT SEMESTER - */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => toggleDropdown(2)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Select Semester</Text>
              {openSection === 2 ? <ArrowUp color="#FFF" /> : <ArrowDown color="#FFF" />}
            </TouchableOpacity>
            {openSection === 2 && (
              <View style={styles.dropdown}>
                <Text style={styles.listText}>Semester options...</Text>
              </View>
            )}
          </View>

          {/* 3. SELECT FACULTY NAME - */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => toggleDropdown(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Select Faculty Name</Text>
              {openSection === 3 ? <ArrowUp color="#FFF" /> : <ArrowDown color="#FFF" />}
            </TouchableOpacity>
            {openSection === 3 && (
              <View style={styles.dropdown}>
                <Text style={styles.listText}>Faculty names list...</Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* View Button - */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav - */}
        <View style={styles.footer}>
          <View style={styles.navBar}>
            <Home color="#888888" size={28} />
            <UserCircle color="#888888" size={28} />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default FacultyAttendanceScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3F4E81',
  },
  container: {
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
    gap: 15,
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
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#1E2139',
    marginTop: -25, // Slide under effect
    paddingTop: 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 120,
  },
  listText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  viewBtn: {
    backgroundColor: '#4E6299',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  viewBtnText: {
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