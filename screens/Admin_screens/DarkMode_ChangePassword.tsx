import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Switch } from 'react-native';
import { Menu, ArrowRight } from 'lucide-react-native';

const COLORS = {
  header: '#435588',     
  background: '#2A2A3A', 
  pill: '#435588',       
  text: '#FFFFFF',
  placeholder: '#A0B0D0',
};

export default function SettingsScreen() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(true);
  const [isAlertOn, setIsAlertOn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={28} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>General Settings</Text>

        {/* Static Pill */}
        <TouchableOpacity style={styles.pill} activeOpacity={0.8}>
          <Text style={styles.pillText}>Account Settings</Text>
          <ArrowRight color={COLORS.text} size={24} />
        </TouchableOpacity>

        {/* Dynamic Accordion: Change Password */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            style={[styles.pill, isPasswordOpen && styles.pillOpen]} 
            onPress={() => setIsPasswordOpen(!isPasswordOpen)}
            activeOpacity={0.9}
          >
            <Text style={styles.pillText}>Change Password</Text>
            <ArrowRight color={COLORS.text} size={24} style={{ transform: [{ rotate: isPasswordOpen ? '90deg' : '0deg' }] }} />
          </TouchableOpacity>
          
          {/* Expanded Drawer Area */}
          {isPasswordOpen && (
            <View style={styles.expandedBox}>
              <View style={styles.innerPill}>
                <TextInput placeholder="Old Password :" placeholderTextColor={COLORS.placeholder} style={styles.inputText} secureTextEntry />
              </View>
              <View style={styles.innerPill}>
                <TextInput placeholder="New Password :" placeholderTextColor={COLORS.placeholder} style={styles.inputText} secureTextEntry />
              </View>
              <View style={styles.innerPill}>
                <TextInput placeholder="Confirm Password :" placeholderTextColor={COLORS.placeholder} style={styles.inputText} secureTextEntry />
              </View>
              
              {/* Close Button inside Drawer */}
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsPasswordOpen(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Toggle Pill */}
        <View style={[styles.pill, { marginTop: 10 }]}>
          <Text style={styles.pillText}>Attendance alert</Text>
          <Switch 
            value={isAlertOn} 
            onValueChange={setIsAlertOn} 
            trackColor={{ false: '#767577', true: '#5D8AC1' }}
            thumbColor={isAlertOn ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, paddingVertical: 15, paddingHorizontal: 15, gap: 15 },
  headerTitle: { fontSize: 20, color: COLORS.text, fontWeight: '500' },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 50 },
  
  sectionTitle: { color: COLORS.text, fontSize: 18, marginBottom: 5, paddingLeft: 5 },
  
  pill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 20, zIndex: 2 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  
  accordionContainer: { marginTop: 5 },
  expandedBox: { 
    backgroundColor: COLORS.background, 
    padding: 15, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    marginTop: -1, 
    borderWidth: 1, 
    borderColor: COLORS.pill,
    gap: 12
  },
  
  innerPill: { backgroundColor: COLORS.pill, padding: 14, borderRadius: 20 },
  inputText: { fontSize: 16, color: COLORS.text, width: '100%' },
  
  closeButton: { backgroundColor: COLORS.pill, padding: 16, borderRadius: 20, alignItems: 'center', marginTop: 5 },
  closeButtonText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
});