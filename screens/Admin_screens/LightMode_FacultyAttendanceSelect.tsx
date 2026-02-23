import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',
  background: '#D1DCE8',
  pill: '#8EBBFF',
  darkCard: '#3E76B1',
  text: '#5D8AC1',
};

export default function FacultyAttendance() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const dropdowns = ["Select Department", "Select Semester", "Select Faculty Name"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Faculty Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Dynamic Dropdowns */}
        {dropdowns.map((label, index) => (
          <View key={index} style={styles.accordionContainer}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => toggleSection(label)}
              style={[styles.dropdownPill, openSection === label && styles.pillOpen]}
            >
              <Text style={styles.pillText}>{label}</Text>
              {openSection === label ? (
                <ChevronUp color={COLORS.text} size={28} />
              ) : (
                <ChevronDown color={COLORS.text} size={28} />
              )}
            </TouchableOpacity>
            
            {/* Expanded Dark Blue Box */}
            {openSection === label && (
              <View style={styles.expandedBox}>
                {/* List items will go here */}
              </View>
            )}
          </View>
        ))}

        {/* View Action Button */}
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Footer */}
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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, padding: 15, gap: 15 },
  headerTitle: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  scrollContent: { padding: 20, gap: 15, paddingBottom: 100 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 30 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginBottom: 5 },
  expandedBox: { backgroundColor: COLORS.darkCard, height: 180, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: -1 },
  viewButton: { backgroundColor: COLORS.pill, padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 30 },
  viewButtonText: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: { backgroundColor: COLORS.header, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});