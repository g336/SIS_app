import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User, CheckCircle2, X } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',
  background: '#D1DCE8',
  pill: '#8EBBFF',
  darkCard: '#3E76B1',
  text: '#5D8AC1',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [selections, setSelections] = useState({ department: 'Department', classroom: 'Classroom' });

  const departments = ["Computer Science", "Mechanical", "Civil", "Electrical"];
  const classrooms = ["Room 101", "Room 102", "Lab A", "Lab B"];

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSelect = (section, value) => {
    setSelections(prev => ({ ...prev, [section]: value }));
    setOpenSection(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Subject Allocation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Department Dropdown */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            onPress={() => toggleSection('dept')}
            style={[styles.dropdownPill, openSection === 'dept' && styles.pillOpen]}
          >
            <Text style={styles.pillText}>{selections.department}</Text>
            {openSection === 'dept' ? <ChevronUp color={COLORS.text} /> : <ChevronDown color={COLORS.text} />}
          </TouchableOpacity>
          {openSection === 'dept' && (
            <View style={styles.expandedBox}>
              {departments.map((item, index) => (
                <TouchableOpacity key={index} style={styles.itemRow} onPress={() => handleSelect('department', item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputPill}>
          <TextInput placeholder="Employee Id :" placeholderTextColor={COLORS.text} style={styles.pillText} />
        </View>

        {/* Classroom Dropdown */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            onPress={() => toggleSection('room')}
            style={[styles.dropdownPill, openSection === 'room' && styles.pillOpen]}
          >
            <Text style={styles.pillText}>{selections.classroom}</Text>
            {openSection === 'room' ? <ChevronUp color={COLORS.text} /> : <ChevronDown color={COLORS.text} />}
          </TouchableOpacity>
          {openSection === 'room' && (
            <View style={styles.expandedBox}>
              {classrooms.map((item, index) => (
                <TouchableOpacity key={index} style={styles.itemRow} onPress={() => handleSelect('classroom', item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Confirm Button triggers Popup */}
        <TouchableOpacity style={styles.confirmButton} onPress={() => setShowPopup(true)}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- DYNAMIC SUCCESS POPUP MODAL --- */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setShowPopup(false)}>
              <X color={COLORS.text} size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Subject allocation Successful</Text>
            
            {/* Dynamic Data Display in Popup */}
            <View style={styles.dataSummary}>
              <Text style={styles.summaryLabel}>Dept: {selections.department}</Text>
              <Text style={styles.summaryLabel}>Room: {selections.classroom}</Text>
            </View>
            
            <View style={styles.iconContainer}>
              <CheckCircle2 color="#4CAF50" size={80} strokeWidth={1.5} />
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowPopup(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Footer */}
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
  scrollContent: { padding: 20, gap: 12, paddingBottom: 100 },
  inputPill: { backgroundColor: COLORS.pill, padding: 15, borderRadius: 30 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 30 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginBottom: 5 },
  expandedBox: { backgroundColor: COLORS.darkCard, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: -1, paddingVertical: 10 },
  itemRow: { paddingVertical: 12, paddingHorizontal: 30, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.2)' },
  itemText: { color: COLORS.white, fontSize: 16 },
  confirmButton: { backgroundColor: COLORS.pill, padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 50 },
  confirmText: { fontSize: 22, color: COLORS.text, fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: COLORS.white, borderRadius: 20, padding: 30, alignItems: 'center' },
  closeIcon: { alignSelf: 'flex-end' },
  modalTitle: { fontSize: 22, color: '#333', textAlign: 'center', marginBottom: 10, fontWeight: '500' },
  dataSummary: { marginBottom: 10, alignItems: 'center' },
  summaryLabel: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
  iconContainer: { marginVertical: 15 },
  modalCloseButton: { backgroundColor: COLORS.darkCard, paddingVertical: 12, paddingHorizontal: 50, borderRadius: 25 },
  modalCloseText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },

  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: { backgroundColor: COLORS.header, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});