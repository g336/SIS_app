import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',     // Light blue header
  background: '#D1DCE8', // Soft grayish-blue background
  pill: '#82B7FF',       // Blue pill color
  darkCard: '#5B8DC6',   // Darker blue for expanded lists
  text: '#3B6A9F',       // Dark blue text
  whiteText: '#FFFFFF',
};

export default function AssessmentScreen() {
  const [openSection, setOpenSection] = useState(null);

  // Dynamic dummy data for the expanding assessment drawers
  const assessmentData = {
    'Sem 1': ['Assignment 1', 'Mid-Term Exam', 'Lab Assessment', 'Final Project'],
    'Sem 2': ['Assignment 1', 'Practical Exam', 'End-Term Exam']
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Assessment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Dynamic Semester Dropdowns */}
        {Object.keys(assessmentData).map((semester, index) => (
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
            
            {/* Expanded Assessment List */}
            {openSection === semester && (
              <View style={styles.expandedBox}>
                {assessmentData[semester].map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.itemRow} activeOpacity={0.7}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.header, 
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    gap: 15 
  },
  headerTitle: { 
    fontSize: 26, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },
  scrollContent: { 
    padding: 25, 
    gap: 20, 
    paddingBottom: 50 
  },
  
  accordionContainer: { 
    marginBottom: 5 
  },
  dropdownPill: { 
    backgroundColor: COLORS.pill, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 25, 
    borderRadius: 30 
  },
  pillOpen: { 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0 
  },
  pillText: { 
    fontSize: 22, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },
  
  expandedBox: { 
    backgroundColor: COLORS.darkCard, 
    paddingVertical: 10,
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    marginTop: -1 
  },
  itemRow: { 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(255,255,255,0.2)' 
  },
  itemText: { 
    color: COLORS.whiteText, 
    fontSize: 18, 
    fontFamily: 'serif' 
  },
});