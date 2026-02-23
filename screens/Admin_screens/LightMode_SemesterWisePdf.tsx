import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',      // Light blue header
  background: '#D1DCE8',  // Grey-ish app background
  pill: '#8EBBFF',        // Semester button light blue
  contentBox: '#3E76B1',  // Dark blue expanded area
  text: '#5D8AC1',        // Muted blue text
};

export default function SemesterWisePdf() {
  // Logic to allow multiple sections to be open at once
  const [openSections, setOpenSections] = useState({ 0: false, 1: true });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const semesters = ["Sem 1", "Sem 2"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Semester Wise Pdf</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {semesters.map((sem, index) => {
          const isOpen = openSections[index];
          
          return (
            <View key={index} style={styles.accordionContainer}>
              {/* Semester Button (Pill Shape) */}
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => toggleSection(index)}
                style={[
                  styles.pill,
                  isOpen && styles.pillOpen // Flattens bottom corners when open
                ]}
              >
                <Text style={[styles.pillText, isOpen && styles.underline]}>
                  {sem}
                </Text>
                {isOpen ? (
                  <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
                ) : (
                  <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
                )}
              </TouchableOpacity>

              {/* Dark Blue Content Area */}
              {isOpen && (
                <View style={styles.expandedBox}>
                  {/* Your PDF list or content goes here */}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Bottom Navigation */}
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
    padding: 15,
    paddingBottom: 100, // Extra space to scroll past the footer
  },
  accordionContainer: {
    marginBottom: 20,
  },
  pill: {
    backgroundColor: COLORS.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    zIndex: 2,
  },
  pillOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pillText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '500',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  expandedBox: {
    backgroundColor: COLORS.contentBox,
    height: 320,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1, // Merges the pill and box perfectly
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },
  footerPill: {
    backgroundColor: COLORS.header,
    height: 55,
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