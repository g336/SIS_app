import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Check } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',       
  background: '#D1DCE8',   
  pill: '#82B7FF',         
  darkCard: '#5B8DC6',     
  text: '#3B6A9F',         
  whiteText: '#FFFFFF',
  
  // Modal specific colors
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: '#4A7AB5', 
  modalButton: '#82B7FF',
};

export default function CounsellorScreen() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  // State to manage the popup modals
  const [popupState, setPopupState] = useState({ visible: false, type: null }); // type: 'approved' | 'denied'

  const handleClosePopup = () => setPopupState({ visible: false, type: null });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Counsellor</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Standard Input Fields */}
        <View style={styles.inputPill}><TextInput placeholder="From :" placeholderTextColor={COLORS.text} style={styles.inputText} /></View>
        <View style={styles.inputPill}><TextInput placeholder="To :" placeholderTextColor={COLORS.text} style={styles.inputText} /></View>
        <View style={styles.inputPill}><TextInput placeholder="Time :" placeholderTextColor={COLORS.text} style={styles.inputText} /></View>

        {/* Large Reason Input Field */}
        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput 
            placeholder="Reason :" 
            placeholderTextColor={COLORS.text} 
            style={styles.inputText} 
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons trigger the Modals */}
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.8}
          onPress={() => setPopupState({ visible: true, type: 'approved' })}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.8}
          onPress={() => setPopupState({ visible: true, type: 'denied' })}
        >
          <Text style={styles.buttonText}>Deny</Text>
        </TouchableOpacity>

        {/* Dynamic Student Leave Report Accordion */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => setIsReportOpen(!isReportOpen)}
            style={[styles.dropdownPill, isReportOpen && styles.pillOpen]}
          >
            <Text style={styles.dropdownText}>Student Leave Report</Text>
            {isReportOpen ? <ChevronUp color={COLORS.text} size={30} strokeWidth={2.5} /> : <ChevronDown color={COLORS.text} size={30} strokeWidth={2.5} />}
          </TouchableOpacity>
          {isReportOpen && (
            <View style={styles.expandedBox}>
              <Text style={styles.placeholderText}>No reports available.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* --- RESULT MODAL (Approved / Denied) --- */}
      <Modal 
        visible={popupState.visible} 
        transparent 
        animationType="fade"
        onRequestClose={handleClosePopup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            <Text style={styles.modalTitle}>
              {popupState.type === 'approved' ? 'Leave Request\nApproved' : 'Leave Request\nDenied'}
            </Text>
            
            <Check color={COLORS.whiteText} size={50} strokeWidth={3} style={styles.modalIcon} />

            <TouchableOpacity style={styles.closeButton} onPress={handleClosePopup} activeOpacity={0.8}>
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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, paddingVertical: 15, paddingHorizontal: 15, gap: 15 },
  headerTitle: { fontSize: 26, color: COLORS.text, fontFamily: 'serif' },
  scrollContent: { padding: 20, gap: 15, paddingBottom: 50 },

  // Input Styles
  inputPill: { backgroundColor: COLORS.pill, paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  largeInput: { height: 150, paddingTop: 15 },
  inputText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif', flex: 1 },

  // Base Button Styles
  actionButton: { backgroundColor: COLORS.pill, paddingVertical: 16, borderRadius: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  buttonText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif' },

  // Accordion Styles
  accordionContainer: { marginTop: 5 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 25, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, elevation: 0, shadowOpacity: 0 },
  dropdownText: { fontSize: 20, color: COLORS.text, fontFamily: 'serif' },
  expandedBox: { backgroundColor: COLORS.darkCard, paddingVertical: 20, paddingHorizontal: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: -1 },
  placeholderText: { color: COLORS.whiteText, fontSize: 16, fontFamily: 'serif', textAlign: 'center' },

  // --- Modal Styles ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: COLORS.modalOverlay, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalCard: { 
    width: '80%', 
    backgroundColor: COLORS.modalBackground, 
    borderRadius: 30, 
    padding: 30, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 28, 
    color: COLORS.whiteText, 
    fontFamily: 'serif', 
    textAlign: 'center', 
    marginBottom: 15,
    lineHeight: 35 
  },
  modalIcon: {
    marginBottom: 30
  },
  closeButton: { 
    backgroundColor: COLORS.modalButton, 
    width: '100%', 
    paddingVertical: 15, 
    borderRadius: 25, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  closeButtonText: { 
    fontSize: 22, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },
});