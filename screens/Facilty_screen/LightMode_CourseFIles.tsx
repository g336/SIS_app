import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Book, Home, User, FileText } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',     // Light blue header
  background: '#D1DCE8', // Soft grayish-blue background
  pill: '#82B7FF',       // Blue pill color
  darkCard: '#5B8DC6',   // Slightly darker blue for expanded file lists
  text: '#3B6A9F',       // Dark blue text
  whiteText: '#FFFFFF',
};

export default function CourseFilesScreen() {
  const [openSection, setOpenSection] = useState(null);

  // Dynamic dummy data for the expanding drawers
  const courseData = {
    'Sem 1': ['Mathematics I', 'Applied Physics', 'Engineering Graphics', 'Basic Computer Science'],
    'Sem 2': ['Mathematics II', 'Applied Chemistry', 'Engineering Mechanics', 'Basic Electrical']
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Course Files</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Dynamic Semester Dropdowns */}
        {Object.keys(courseData).map((semester, index) => (
          <View key={index} style={styles.accordionContainer}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => toggleSection(semester)}
              style={[styles.dropdownPill, openSection === semester && styles.pillOpen]}
            >
              <Text style={styles.pillText}>{semester}</Text>
              {openSection === semester ? (
                <ChevronUp color={COLORS.text} size={30} strokeWidth={2.5} />
              ) : (
                <ChevronDown color={COLORS.text} size={30} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
            
            {/* Expanded File List */}
            {openSection === semester && (
              <View style={styles.expandedBox}>
                {courseData[semester].map((subject, idx) => (
                  <TouchableOpacity key={idx} style={styles.itemRow} activeOpacity={0.7}>
                    <Text style={styles.itemText}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

      </ScrollView>

      {/* Floating Navigation Bar */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Book color={COLORS.text} size={28} strokeWidth={2.5} />
          <Home color={COLORS.text} size={32} strokeWidth={2.5} />
          <User color={COLORS.text} size={28} strokeWidth={2.5} />
          <FileText color={COLORS.text} size={28} strokeWidth={2.5} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, 
    paddingVertical: 15, paddingHorizontal: 15, gap: 15 
  },
  headerTitle: { fontSize: 26, color: COLORS.text, fontFamily: 'serif' },
  scrollContent: { padding: 25, gap: 20, paddingBottom: 100 },
  
  accordionContainer: { marginBottom: 5 },
  dropdownPill: { 
    backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingVertical: 16, paddingHorizontal: 25, borderRadius: 30 
  },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 22, color: COLORS.text, fontFamily: 'serif' },
  
  expandedBox: { 
    backgroundColor: COLORS.darkCard, paddingVertical: 10,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: -1 
  },
  itemRow: { 
    paddingVertical: 15, paddingHorizontal: 30, 
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.2)' 
  },
  itemText: { color: COLORS.whiteText, fontSize: 18, fontFamily: 'serif' },
  
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: { 
    backgroundColor: COLORS.header, height: 60, borderRadius: 30, 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' 
  },
});