import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header
  background: '#D1DCE8', // Grey-ish background
  pill: '#8EBBFF',       // Input pill color
  darkCard: '#3E76B1',   // Dark blue expanded card
  text: '#5D8AC1',       // Primary muted blue text
};

export default function FacultyEntry() {
  // Logic to track open/closed state for each section independently
  const [openSections, setOpenSections] = useState({
    designation: false,
    department: false,
    qualification: true // Qualification is open by default as per reference
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const inputFields = ["Full Name:", "Employee ID :", "DOB :", "Gender :", "Contact Number:", "Email ID :", "Address :"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Faculty Entry</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {inputFields.map((label, index) => (
          <View key={index} style={styles.inputPill}>
            <Text style={styles.inputText}>{label}</Text>
          </View>
        ))}

        {/* --- DESIGNATION SECTION --- */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => toggleSection('designation')}
            style={[styles.dropdownPill, openSections.designation && styles.pillOpen]}
          >
            <Text style={styles.inputText}>Designation</Text>
            {openSections.designation ? <ChevronUp color={COLORS.text} size={28} /> : <ChevronDown color={COLORS.text} size={28} />}
          </TouchableOpacity>
          {openSections.designation && <View style={styles.expandedBox} />}
        </View>

        {/* --- DEPARTMENT SECTION --- */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => toggleSection('department')}
            style={[styles.dropdownPill, openSections.department && styles.pillOpen]}
          >
            <Text style={styles.inputText}>Department</Text>
            {openSections.department ? <ChevronUp color={COLORS.text} size={28} /> : <ChevronDown color={COLORS.text} size={28} />}
          </TouchableOpacity>
          {openSections.department && <View style={styles.expandedBox} />}
        </View>

        {/* --- QUALIFICATION SECTION --- */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => toggleSection('qualification')}
            style={[styles.dropdownPill, openSections.qualification && styles.pillOpen]}
          >
            <Text style={styles.inputText}>Qualification</Text>
            {openSections.qualification ? <ChevronUp color={COLORS.text} size={28} /> : <ChevronDown color={COLORS.text} size={28} />}
          </TouchableOpacity>
          {openSections.qualification && <View style={styles.expandedBox} />}
        </View>

        <View style={styles.inputPill}>
          <Text style={styles.inputText}>Joining Date :</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, paddingVertical: 12, paddingHorizontal: 15, gap: 15 },
  headerTitle: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 100 },
  inputPill: { backgroundColor: COLORS.pill, paddingVertical: 14, paddingHorizontal: 25, borderRadius: 35 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 35 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  inputText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginBottom: 10 },
  expandedBox: { backgroundColor: COLORS.darkCard, height: 250, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, marginTop: -1 },
  addButton: { backgroundColor: COLORS.pill, paddingVertical: 16, borderRadius: 35, alignItems: 'center', marginTop: 10 },
  addButtonText: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: { backgroundColor: COLORS.header, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});