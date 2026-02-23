import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ArrowRight, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',
  background: '#D1DCE8',
  pill: '#8EBBFF',
  text: '#5D8AC1',
  modalOverlay: 'rgba(40, 60, 90, 0.7)', // Darkened backdrop
};

export default function SettingsScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Settings Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={28} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        
        <View style={styles.pill}><Text style={styles.pillText}>Account Settings</Text><ArrowRight color={COLORS.text} /></View>
        
        {/* Clickable Change Password */}
        <TouchableOpacity 
          style={styles.pill} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pillText}>Change Password</Text>
          <ArrowRight color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.pill}><Text style={styles.pillText}>Leave Application</Text><ArrowRight color={COLORS.text} /></View>
      </ScrollView>

      {/* Dynamic Modal Logic */}
      {isModalVisible && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.modalCard}>
            {/* Input Pills */}
            <View style={styles.inputRow}><Text style={styles.inputText}>Old Password :</Text></View>
            <View style={styles.inputRow}><Text style={styles.inputText}>New Password :</Text></View>
            <View style={styles.inputRow}><Text style={styles.inputText}>Confirm Password :</Text></View>

            {/* Dynamic Close Logic */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Footer Nav */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={28} />
          <User color={COLORS.text} size={28} />
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
    padding: 15, 
    gap: 15 
  },
  headerTitle: { fontSize: 20, color: COLORS.text, fontWeight: '500' },
  scrollArea: { padding: 15 },
  sectionTitle: { color: COLORS.text, fontSize: 18, marginBottom: 15 },
  pill: { 
    backgroundColor: COLORS.pill, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderRadius: 30, 
    marginBottom: 12 
  },
  pillText: { color: COLORS.text, fontSize: 18 },
  
  // Modal Background Styles
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCard: {
    width: '85%',
    backgroundColor: COLORS.background,
    borderRadius: 25,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#AABCCA',
  },
  inputRow: {
    backgroundColor: COLORS.header,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  inputText: { color: COLORS.text, fontSize: 16 },
  closeButton: {
    backgroundColor: COLORS.header,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: { color: COLORS.text, fontSize: 20, fontWeight: '600' },
  
  footerWrapper: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  footerPill: { 
    backgroundColor: COLORS.header, 
    height: 50, 
    borderRadius: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  }
});