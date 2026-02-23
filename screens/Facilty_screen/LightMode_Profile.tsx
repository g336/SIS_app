import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Check } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',       // Light blue header
  background: '#D1DCE8',   // Soft grayish-blue background
  pill: '#82B7FF',         // Primary pill color
  text: '#3B6A9F',         // Dark blue text
  modalOverlay: 'rgba(0, 0, 0, 0.4)',
  modalCard: '#E2EAF2',    // Modal background color
};

export default function UpdateProfileScreen() {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success state

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Form Fields */}
        <View style={styles.inputPill}>
          <TextInput placeholder="Name :" placeholderTextColor={COLORS.text} style={styles.inputText} />
        </View>

        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput 
            placeholder="Contact :" 
            placeholderTextColor={COLORS.text} 
            style={styles.inputText} 
            multiline 
            textAlignVertical="top" 
          />
        </View>

        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput 
            placeholder="Address :" 
            placeholderTextColor={COLORS.text} 
            style={styles.inputText} 
            multiline 
            textAlignVertical="top" 
          />
        </View>

        {/* Apply Button triggers Success Modal */}
        <TouchableOpacity 
          style={styles.applyButton} 
          activeOpacity={0.8}
          onPress={() => setShowSuccessModal(true)}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>

        {/* Documents Accordion */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => setIsDocumentsOpen(!isDocumentsOpen)}
            style={styles.dropdownPill}
          >
            <Text style={styles.dropdownText}>Documents</Text>
            {isDocumentsOpen ? (
              <ChevronUp color={COLORS.text} size={30} />
            ) : (
              <ChevronDown color={COLORS.text} size={30} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- PROFILE UPDATE SUCCESS MODAL --- */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            <Text style={styles.modalTitle}>
              Profile Update Request{"\n"}Sent Successfully
            </Text>
            
            <Check color={COLORS.text} size={50} strokeWidth={3} style={styles.checkIcon} />

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowSuccessModal(false)}
            >
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
  scrollContent: { padding: 20, gap: 15 },
  inputPill: { backgroundColor: COLORS.pill, padding: 15, borderRadius: 30 },
  largeInput: { height: 150 },
  inputText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif' },
  applyButton: { backgroundColor: COLORS.pill, padding: 16, borderRadius: 30, alignItems: 'center' },
  buttonText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif' },
  accordionContainer: { marginTop: 5 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 30 },
  dropdownText: { fontSize: 20, color: COLORS.text, fontFamily: 'serif' },

  // --- Modal Styles ---
  modalOverlay: { flex: 1, backgroundColor: COLORS.modalOverlay, justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: COLORS.modalCard, borderRadius: 30, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 22, color: COLORS.text, textAlign: 'center', marginBottom: 20, fontFamily: 'serif', lineHeight: 28 },
  checkIcon: { marginBottom: 25 },
  closeButton: { backgroundColor: COLORS.pill, width: '100%', padding: 15, borderRadius: 25, alignItems: 'center' },
  closeButtonText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif' },
});