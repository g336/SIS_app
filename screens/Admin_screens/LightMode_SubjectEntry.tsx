import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Menu, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header
  background: '#D1DCE8', // Grey-ish background
  pill: '#8EBBFF',       // Input pill color
  text: '#5D8AC1',       // Primary muted blue text
};

export default function App() {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [uploadDate, setUploadDate] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Subject Entry</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subject Name Input */}
        <View style={styles.inputPill}>
          <TextInput
            style={styles.inputText}
            placeholder="Subject Name:"
            placeholderTextColor={COLORS.text}
            value={subjectName}
            onChangeText={setSubjectName}
          />
        </View>

        {/* Subject Code Input */}
        <View style={styles.inputPill}>
          <TextInput
            style={styles.inputText}
            placeholder="Subject Code :"
            placeholderTextColor={COLORS.text}
            value={subjectCode}
            onChangeText={setSubjectCode}
          />
        </View>

        {/* Subject Upload Date Input */}
        <View style={styles.inputPill}>
          <TextInput
            style={styles.inputText}
            placeholder="Subject Upload Date :"
            placeholderTextColor={COLORS.text}
            value={uploadDate}
            onChangeText={setUploadDate}
          />
        </View>

        {/* Add Action Button */}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={30} />
          <View style={styles.activeIconContainer}>
            <User color={COLORS.text} size={30} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.header,
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    gap: 15,
  },
  inputPill: {
    backgroundColor: COLORS.pill,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: '#5D8AC1', // Slight border as seen in image_aa7a3b
  },
  inputText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.pill,
    paddingVertical: 16,
    borderRadius: 35,
    alignItems: 'center',
    marginTop: 250, // Pushes button down as seen in image_aa7a3b
  },
  addButtonText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '500',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },
  footerPill: {
    backgroundColor: COLORS.header,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  activeIconContainer: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.text,
    paddingBottom: 2,
  }
});