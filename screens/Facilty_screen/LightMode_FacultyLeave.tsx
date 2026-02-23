import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Check } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',       
  background: '#D1DCE8',   
  pill: '#82B7FF',         
  darkCard: '#3B6A9F',     
  text: '#3B6A9F',         
  whiteText: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
  modalCard: '#E2EAF2',
};

export default function FacultyLeaveScreen() {
  const [openSection, setOpenSection] = useState(null); // Manages accordions
  const [showSuccess, setShowSuccess] = useState(false); // Manages success popup

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Leave</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Core Leave Form Fields */}
        <View style={styles.inputPill}><TextInput placeholder="From :" placeholderTextColor={COLORS.text} style={styles.inputText} /></View>
        <View style={styles.inputPill}><TextInput placeholder="To :" placeholderTextColor={COLORS.text} style={styles.inputText} /></View>
        <View style={styles.inputPill}><TextInput placeholder="Time :" placeholderTextColor={COLORS.text} style={styles.inputText} /></View>
        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput placeholder="Reason :" placeholderTextColor={COLORS.text} style={styles.inputText} multiline textAlignVertical="top" />
        </View>

        {/* Types of Leave Accordion */}
        <View style={styles.accordionGroup}>
          <TouchableOpacity 
            onPress={() => toggleSection('type')} 
            style={[styles.dropdownPill, openSection === 'type' && styles.pillOpen]}
          >
            <Text style={styles.dropdownText}>Types of leave</Text>
            {openSection === 'type' ? <ChevronUp color={COLORS.text} size={28} /> : <ChevronDown color={COLORS.text} size={28} />}
          </TouchableOpacity>
          {openSection === 'type' && (
            <View style={styles.expandedContent}><Text style={styles.contentText}>Select leave category...</Text></View>
          )}
        </View>

        {/* Workload Distribution Accordion */}
        <View style={styles.accordionGroup}>
          <TouchableOpacity 
            onPress={() => toggleSection('workload')} 
            style={[styles.dropdownPill, openSection === 'workload' && styles.pillOpen]}
          >
            <Text style={styles.dropdownText}>Work load Destribution</Text>
            {openSection === 'workload' ? <ChevronUp color={COLORS.text} size={28} /> : <ChevronDown color={COLORS.text} size={28} />}
          </TouchableOpacity>
          {openSection === 'workload' && (
            <View style={styles.expandedContent}><Text style={styles.contentText}>Assign substitute faculty...</Text></View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.applyButton} onPress={() => setShowSuccess(true)}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>

        {/* Bottom Leave Report */}
        <View style={styles.accordionGroup}>
          <TouchableOpacity onPress={() => toggleSection('report')} style={[styles.dropdownPill, openSection === 'report' && styles.pillOpen]}>
            <Text style={styles.dropdownText}>Leave Report</Text>
            {openSection === 'report' ? <ChevronUp color={COLORS.text} size={28} /> : <ChevronDown color={COLORS.text} size={28} />}
          </TouchableOpacity>
          {openSection === 'report' && (
            <View style={[styles.expandedContent, { backgroundColor: COLORS.darkCard }]} />
          )}
        </View>
      </ScrollView>

      {/* --- SUCCESS POPUP MODAL --- */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Leave request sent successfully</Text>
            <Check color={COLORS.text} size={50} strokeWidth={3} style={styles.checkIcon} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSuccess(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, padding: 15, gap: 15 },
  headerTitle: { fontSize: 26, color: COLORS.text, fontFamily: 'serif' },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 50 },
  inputPill: { backgroundColor: COLORS.pill, padding: 15, borderRadius: 30, elevation: 3 },
  largeInput: { height: 120 },
  inputText: { fontSize: 18, color: COLORS.text, fontFamily: 'serif' },
  accordionGroup: { marginTop: 5 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 25 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownText: { fontSize: 18, color: COLORS.text, fontFamily: 'serif' },
  expandedContent: { backgroundColor: '#F0F4F8', padding: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, marginTop: -1 },
  contentText: { color: COLORS.text, fontFamily: 'serif' },
  applyButton: { backgroundColor: COLORS.pill, padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonText: { fontSize: 22, color: COLORS.text, fontWeight: 'bold' },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: COLORS.modalCard, borderRadius: 30, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 22, color: COLORS.text, textAlign: 'center', marginBottom: 20, fontFamily: 'serif' },
  checkIcon: { marginBottom: 25 },
  closeButton: { backgroundColor: COLORS.pill, width: '100%', padding: 15, borderRadius: 25, alignItems: 'center' },
  closeButtonText: { fontSize: 20, color: COLORS.text, fontFamily: 'serif' }
});