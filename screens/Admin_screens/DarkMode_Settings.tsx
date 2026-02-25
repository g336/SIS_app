import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Menu, ChevronRight } from 'lucide-react-native';

// Types for our different setting row variants
type SettingType = 'link' | 'toggle';

interface SettingRowProps {
  label: string;
  type: SettingType;
  value?: boolean;
  onValueChange?: (newValue: boolean) => void;
  onPress?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ 
  label, 
  type, 
  value, 
  onValueChange, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.row} 
      onPress={type === 'link' ? onPress : undefined}
      activeOpacity={type === 'link' ? 0.7 : 1}
    >
      <Text style={styles.rowText}>{label}</Text>
      
      {type === 'link' ? (
        <ChevronRight color="#FFFFFF" size={24} />
      ) : (
        <Switch
          trackColor={{ false: '#3e3e3e', true: '#4DA8FF' }}
          thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onValueChange}
          value={value}
        />
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  // States for the toggle switches
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [examReminder, setExamReminder] = useState(true);
  const [attendanceAlert, setAttendanceAlert] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Menu color="#FFFFFF" size={28} />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>General Settings</Text>

          {/* Navigation Links */}
          <SettingRow 
            label="Account Settings" 
            type="link" 
            onPress={() => console.log('Navigate to Account')} 
          />
          <SettingRow 
            label="Change Password" 
            type="link" 
            onPress={() => console.log('Navigate to Password')} 
          />
          <SettingRow 
            label="Leave Application" 
            type="link" 
            onPress={() => console.log('Navigate to Leave')} 
          />

          {/* Toggle Switches */}
          <SettingRow 
            label="Dark Mode" 
            type="toggle" 
            value={isDarkMode} 
            onValueChange={setIsDarkMode} 
          />
          <SettingRow 
            label="Exam reminder" 
            type="toggle" 
            value={examReminder} 
            onValueChange={setExamReminder} 
          />
          <SettingRow 
            label="Attendance alert" 
            type="toggle" 
            value={attendanceAlert} 
            onValueChange={setAttendanceAlert} 
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3F4E81', // Matches header color for notch area
  },
  container: {
    flex: 1,
    backgroundColor: '#11121E', // Dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3F4E81',
    gap: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 4,
  },
  row: {
    backgroundColor: '#4E6299',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  rowText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
});

export default SettingsScreen;