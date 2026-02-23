import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header
  background: '#D1DCE8', // Grey-ish background
  pill: '#8EBBFF',       // Input pill color
  darkCard: '#3E76B1',   // Dark blue expanded box
  text: '#5D8AC1',       // Primary muted blue text
};

export default function StudentEntry() {
  // Independent state for each dropdown
  const [openSections, setOpenSections] = useState({
    course: true,       // Open by default based on image_aa2025
    department: false,
    admissionYear: true  // Open by default based on image_aa1c7d
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const textInputs = [
    "Full Name:", "Enrollment Num :", "DOB :", 
    "Gender :", "Contact Number:", "Email ID :", "Address :"
  ];

  // Reusable Dropdown Component
  const DropdownPill = ({ label, sectionKey }) => {
    const isOpen = openSections[sectionKey];
    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => toggleSection(sectionKey)}
          style={[styles.pill, isOpen && styles.pillOpen]}
        >
          <Text style={styles.pillText}>{label}</Text>
          {isOpen ? (
            <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
          ) : (
            <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
          )}
        </TouchableOpacity>
        {isOpen && <View style={styles.expandedBox} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Student Entry</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Regular Text Input Pills */}
        {textInputs.map((label, index) => (
          <View key={index} style={styles.pill}>
            <Text style={styles.pillText}>{label}</Text>
          </View>
        ))}

        {/* Dynamic Selection Sections */}
        <DropdownPill label="Course" sectionKey="course" />
        <DropdownPill label="Select Department" sectionKey="department" />
        <DropdownPill label="Admission Year" sectionKey="admissionYear" />

        {/* Submit Action */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Footer Navigation */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={30} />
          <User color={COLORS.text} size={30} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.header,
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 15,
  },
  headerTitle: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 100 },
  pill: {
    backgroundColor: COLORS.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 35,
  },
  pillOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 2,
  },
  pillText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginBottom: 5 },
  expandedBox: {
    backgroundColor: COLORS.darkCard,
    height: 250, // Matches the expansion depth
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1, // Seamlessly connects to the pill above
  },
  addButton: {
    backgroundColor: COLORS.pill,
    paddingVertical: 16,
    borderRadius: 35,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: {
    backgroundColor: COLORS.header,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});