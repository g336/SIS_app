import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { Menu, ArrowRight, Home, User } from 'lucide-react-native';

const BLUE_LIGHT = '#8EBBFF';
const BG_COLOR = '#D1DCE8';
const TEXT_COLOR = '#4A76AD';

interface SettingItemProps {
  label: string;
  isToggle?: boolean;
}

const SettingItem = ({ label, isToggle }: SettingItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <TouchableOpacity style={styles.itemContainer} activeOpacity={0.8} disabled={isToggle}>
      <Text style={styles.itemText}>{label}</Text>
      {isToggle ? (
        <Switch
          trackColor={{ false: '#767577', true: TEXT_COLOR }}
          thumbColor="#f4f3f4"
          onValueChange={() => setIsEnabled(!isEnabled)}
          value={isEnabled}
        />
      ) : (
        <ArrowRight color={TEXT_COLOR} size={24} strokeWidth={3} />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={TEXT_COLOR} size={28} strokeWidth={3} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        
        <SettingItem label="Account Settings" />
        <SettingItem label="Change Password" />
        <SettingItem label="Leave Application" />
        <SettingItem label="Dark Mode" isToggle />
        <SettingItem label="Exam reminder" isToggle />
        <SettingItem label="Attendance alert" isToggle />
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Home color={TEXT_COLOR} size={30} />
        <View style={styles.userIconCircle}>
           <User color={TEXT_COLOR} size={24} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE_LIGHT,
    padding: 15,
    gap: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    color: TEXT_COLOR,
    fontWeight: '500',
    marginBottom: 15,
  },
  itemContainer: {
    backgroundColor: BLUE_LIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 18,
    color: TEXT_COLOR,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: BLUE_LIGHT,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userIconCircle: {
    borderBottomWidth: 2,
    borderBottomColor: TEXT_COLOR,
    paddingBottom: 2,
  }
});