import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',
  background: '#D1DCE8',
  pill: '#8EBBFF',
  expanded: '#3E76B1',
  text: '#5D8AC1',
};

export default function StudentAttendance() {
  // Logic to track which dropdown is open
  const [openSection, setOpenSection] = useState({ dept: true, sem: false });

  const toggleSection = (key) => {
    setOpenSection(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Student Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Select Department Dropdown */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => toggleSection('dept')}
            style={[styles.dropdownPill, openSection.dept && styles.pillOpen]}
          >
            <Text style={styles.pillText}>Select Department</Text>
            {openSection.dept ? (
              <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
            ) : (
              <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
            )}
          </TouchableOpacity>
          {openSection.dept && <View style={styles.expandedBox} />}
        </View>

        {/* Select Semester Dropdown */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => toggleSection('sem')}
            style={[styles.dropdownPill, openSection.sem && styles.pillOpen]}
          >
            <Text style={[styles.pillText, styles.underline]}>Select Semester</Text>
            {openSection.sem ? (
              <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
            ) : (
              <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
            )}
          </TouchableOpacity>
          {openSection.sem && <View style={styles.expandedBox} />}
        </View>

        {/* View Action Button */}
        <TouchableOpacity style={styles.viewButton} activeOpacity={0.8}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Navigation */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={30} />
          <View style={styles.activeIconContainer}>
            <User color={COLORS.text} size={30} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.header,
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingTop: 30,
    gap: 10,
  },
  accordionContainer: {
    marginBottom: 5,
  },
  dropdownPill: {
    backgroundColor: COLORS.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    zIndex: 2,
  },
  pillOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pillText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '500',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  expandedBox: {
    backgroundColor: COLORS.expanded,
    height: 300,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1,
    // Add shadow/elevation if you want it to pop like the timetable image
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  viewButton: {
    backgroundColor: COLORS.pill,
    paddingVertical: 16,
    borderRadius: 35,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '500',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },
  footerPill: {
    backgroundColor: COLORS.header,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  activeIconContainer: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.text,
    paddingBottom: 2,
  }
});