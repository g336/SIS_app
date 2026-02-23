import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header
  background: '#D1DCE8', // Grey-ish background
  pill: '#8EBBFF',       // Selection pill color
  darkCard: '#3E76B1',   // Dark blue expanded card
  text: '#5D8AC1',       // Primary muted blue text
};

// Use "export default" to fix the rendering error
export default function App() {
  const [isCourseOpen, setIsCourseOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Course</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Dynamic Select Course Dropdown */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => setIsCourseOpen(!isCourseOpen)}
            style={[
              styles.dropdownPill, 
              isCourseOpen && styles.pillOpen
            ]}
          >
            <Text style={styles.pillText}>Select Course</Text>
            {isCourseOpen ? (
              <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
            ) : (
              <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
            )}
          </TouchableOpacity>

          {/* Expanded Dark Blue Box */}
          {isCourseOpen && (
            <View style={styles.expandedBox}>
               {/* Course content or list goes here */}
            </View>
          )}
        </View>
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
  accordionContainer: {
    marginBottom: 20,
  },
  dropdownPill: {
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
  expandedBox: {
    backgroundColor: COLORS.darkCard,
    height: 350, // Matches expanded depth
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1, // Seamless connection between pill and box
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