import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Menu, ChevronUp, ChevronDown } from 'lucide-react-native';

const COLORS = {
  header: '#435588',     // Header color
  background: '#2A2A3A', // Background / Drawer body
  pill: '#435588',       // Buttons and Text Areas
  text: '#FFFFFF',
  placeholder: '#A0B0D0',
};

export default function UpdateProfile() {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Menu color={COLORS.text} size={26} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputPill}>
          <TextInput placeholder="Name :" placeholderTextColor={COLORS.placeholder} style={styles.inputText} />
        </View>

        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput placeholder="Contact :" placeholderTextColor={COLORS.placeholder} style={styles.inputText} multiline />
        </View>

        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput placeholder="Address :" placeholderTextColor={COLORS.placeholder} style={styles.inputText} multiline />
        </View>

        <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>

        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            style={[styles.dropdownPill, isDocumentsOpen && styles.pillOpen]} 
            onPress={() => setIsDocumentsOpen(!isDocumentsOpen)}
            activeOpacity={0.9}
          >
            <Text style={styles.pillText}>Documents</Text>
            {isDocumentsOpen ? <ChevronDown color={COLORS.text} size={24} /> : <ChevronUp color={COLORS.text} size={24} />}
          </TouchableOpacity>
          
          {isDocumentsOpen && (
            <View style={styles.expandedBox}>
              <Text style={{color: COLORS.placeholder, textAlign: 'center'}}>
                No documents currently uploaded.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, paddingVertical: 14, paddingHorizontal: 15, gap: 15 },
  headerTitle: { fontSize: 20, color: COLORS.text, fontWeight: '500' },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 50 },
  inputPill: { backgroundColor: COLORS.pill, padding: 15, borderRadius: 20 },
  largeInput: { height: 140, alignItems: 'flex-start', paddingTop: 15 },
  inputText: { fontSize: 16, color: COLORS.text, width: '100%' },
  applyButton: { backgroundColor: COLORS.pill, padding: 15, borderRadius: 20, alignItems: 'center', marginTop: 5 },
  applyText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginTop: 5 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 20, zIndex: 2 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  expandedBox: { backgroundColor: COLORS.background, height: 120, padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: -1, borderWidth: 1, borderColor: COLORS.pill },
});