import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User, CheckCircle2 } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header
  background: '#D1DCE8', // Grey-ish background
  pill: '#8EBBFF',       // Input pill color
  darkCard: '#3E76B1',   // Dark blue expanded card
  text: '#5D8AC1',       // Primary muted blue text
};

export default function AcademicDetails() {
  const [showPopup, setShowPopup] = useState(false);
  const [openSections, setOpenSections] = useState({});

  // Dynamic toggle function for all sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const dropdowns = [
    "Department", "Semester / Year", "Day & Time Slots", 
    "Day of the Week", "Start Time & End Time", "Subject Name", 
    "Subject Code", "Faculty Name", "Faculty ID", "Classroom", "Type of Class"
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Academic Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Dynamic Dropdown Render */}
        {dropdowns.map((label, index) => (
          <View key={index} style={styles.accordionContainer}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => toggleSection(label)}
              style={[styles.dropdownPill, openSections[label] && styles.pillOpen]}
            >
              <Text style={styles.pillText}>{label}</Text>
              {openSections[label] ? (
                <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
              ) : (
                <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
              )}
            </TouchableOpacity>
            {openSections[label] && <View style={styles.expandedBox} />}
          </View>
        ))}

        {/* Standard Text Inputs */}
        <View style={styles.inputPill}>
          <TextInput placeholder="Lecture Number :" placeholderTextColor={COLORS.text} style={styles.pillText} />
        </View>

        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput 
            placeholder="Subject Details :" 
            placeholderTextColor={COLORS.text} 
            style={styles.pillText}
            multiline
          />
        </View>

        {/* Confirm Action Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={() => setShowPopup(true)}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={30} />
          <User color={COLORS.text} size={30} />
        </View>
      </View>

      {/* Success Popup Logic */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Details Saved Successful</Text>
            <CheckCircle2 color="#4CAF50" size={70} />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowPopup(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  inputPill: { backgroundColor: COLORS.pill, paddingVertical: 14, paddingHorizontal: 25, borderRadius: 35 },
  largeInput: { height: 120, alignItems: 'flex-start' }, // Matches Subject Details box
  dropdownPill: {
    backgroundColor: COLORS.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 35,
  },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginBottom: 2 },
  expandedBox: {
    backgroundColor: COLORS.darkCard,
    height: 150,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1,
  },
  confirmButton: {
    backgroundColor: COLORS.pill,
    paddingVertical: 16,
    borderRadius: 35,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: {
    backgroundColor: COLORS.header,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', gap: 20 },
  modalTitle: { fontSize: 20, color: COLORS.text, textAlign: 'center', fontWeight: 'bold' },
  modalClose: { backgroundColor: COLORS.pill, paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20 },
  modalCloseText: { color: COLORS.text, fontWeight: 'bold' }
});