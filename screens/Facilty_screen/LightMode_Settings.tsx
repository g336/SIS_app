import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Switch, Modal, TextInput } from 'react-native';
import { Menu, ArrowRight } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',       // Header blue
  background: '#D1DCE8',   // Background gray-blue
  pill: '#82B7FF',         // Main pill color
  text: '#3B6A9F',         // Primary text blue
  modalOverlay: 'rgba(0, 0, 0, 0.4)',
  modalCard: '#E2EAF2',    // Light gray modal card
  innerPill: '#82B7FF',    // Input pills inside modal
  placeholder: '#4A7AB5',
};

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false); // Modal state

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <TouchableOpacity style={styles.pill} activeOpacity={0.8}>
          <Text style={styles.pillText}>Account Settings</Text>
          <ArrowRight color={COLORS.text} size={28} />
        </TouchableOpacity>

        {/* Change Password Trigger */}
        <TouchableOpacity 
          style={styles.pill} 
          activeOpacity={0.8}
          onPress={() => setPasswordModalVisible(true)}
        >
          <Text style={styles.pillText}>Change Password</Text>
          <ArrowRight color={COLORS.text} size={28} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.pill} activeOpacity={0.8}>
          <Text style={styles.pillText}>Leave Application</Text>
          <ArrowRight color={COLORS.text} size={28} />
        </TouchableOpacity>

        <View style={styles.pill}>
          <Text style={styles.pillText}>Dark Mode</Text>
          <Switch 
            value={isDarkMode} 
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#A0B0D0', true: COLORS.text }}
          />
        </View>
      </ScrollView>

      {/* --- CHANGE PASSWORD POPUP --- */}
      <Modal visible={isPasswordModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            {/* Input Fields */}
            <View style={styles.modalInputPill}>
              <TextInput placeholder="Old Password :" placeholderTextColor={COLORS.placeholder} style={styles.modalInput} secureTextEntry />
            </View>
            <View style={styles.modalInputPill}>
              <TextInput placeholder="New Password :" placeholderTextColor={COLORS.placeholder} style={styles.modalInput} secureTextEntry />
            </View>
            <View style={styles.modalInputPill}>
              <TextInput placeholder="Confirm Password :" placeholderTextColor={COLORS.placeholder} style={styles.modalInput} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.tryAnotherWay}>
              <Text style={styles.tryAnotherText}>Try another way</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setPasswordModalVisible(false)}
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
  scrollContent: { padding: 20, gap: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 22, fontFamily: 'serif', marginBottom: 5 },
  pill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 30 },
  pillText: { fontSize: 20, color: COLORS.text, fontFamily: 'serif' },

  // --- Modal Styles ---
  modalOverlay: { flex: 1, backgroundColor: COLORS.modalOverlay, justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: COLORS.modalCard, borderRadius: 30, padding: 25 },
  modalInputPill: { backgroundColor: COLORS.innerPill, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 12 },
  modalInput: { fontSize: 18, color: COLORS.text, fontFamily: 'serif' },
  tryAnotherWay: { alignSelf: 'flex-start', marginLeft: 10, marginBottom: 20 },
  tryAnotherText: { fontSize: 14, color: COLORS.text, fontFamily: 'serif', opacity: 0.7 },
  closeButton: { backgroundColor: COLORS.innerPill, borderRadius: 25, paddingVertical: 15, alignItems: 'center' },
  closeButtonText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif' },
});