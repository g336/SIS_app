import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView 
} from 'react-native';
import { Menu, ArrowRight } from 'lucide-react-native';

export default function SettingsScreen() {
  // State for the toggle switches
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExamReminder, setIsExamReminder] = useState(false);
  const [isAttendanceAlert, setIsAttendanceAlert] = useState(false);

  // Reusable Component for Action Rows (Items with Arrows)
  const ActionRow = ({ title, onPress }) => (
    <TouchableOpacity style={styles.settingCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.settingText}>{title}</Text>
      <ArrowRight color="#4A6FA5" size={28} strokeWidth={2.5} />
    </TouchableOpacity>
  );

  // Reusable Component for Toggle Rows
  const ToggleRow = ({ title, isOn, onToggle }) => (
    <View style={styles.settingCard}>
      <Text style={styles.settingText}>{title}</Text>
      
      {/* Custom Hollow Toggle to perfectly match the mockup */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onToggle} 
        style={styles.toggleTrack}
      >
        <View style={[styles.toggleThumb, isOn ? styles.thumbOn : styles.thumbOff]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>General Settings</Text>

        {/* Action Items */}
        <ActionRow title="Account Settings" onPress={() => {}} />
        <ActionRow title="Change Password" onPress={() => {}} />
        <ActionRow title="Leave Application" onPress={() => {}} />

        {/* Toggle Items */}
        <ToggleRow 
          title="Dark Mode" 
          isOn={isDarkMode} 
          onToggle={() => setIsDarkMode(!isDarkMode)} 
        />
        <ToggleRow 
          title="Exam reminder" 
          isOn={isExamReminder} 
          onToggle={() => setIsExamReminder(!isExamReminder)} 
        />
        <ToggleRow 
          title="Attendance alert" 
          isOn={isAttendanceAlert} 
          onToggle={() => setIsAttendanceAlert(!isAttendanceAlert)} 
        />

        {/* Spacer for bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#CBD5E1' 
  },
  header: { 
    height: 60, 
    backgroundColor: '#8EBBFF', 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 15 
  },
  menuIcon: { marginRight: 15 },
  headerTitle: { fontSize: 26, color: '#4A6FA5', fontFamily: 'serif' },
  scrollContent: { padding: 20, paddingTop: 25 },

  // Section Typography
  sectionTitle: {
    fontSize: 24,
    color: '#4A6FA5',
    fontFamily: 'serif',
    marginBottom: 20,
    marginLeft: 5,
  },

  // Pill-shaped Setting Cards
  settingCard: {
    backgroundColor: '#8EBBFF',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    // Drop shadow matching the image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  settingText: {
    color: '#4A6FA5',
    fontSize: 22,
    fontFamily: 'serif',
  },

  // Custom Toggle Styles (Matching the hollow ring aesthetic)
  toggleTrack: {
    width: 60,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#4A6FA5',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#4A6FA5',
    backgroundColor: 'transparent', // Hollow center
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});