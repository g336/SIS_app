import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ArrowRight, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header background
  background: '#D1DCE8', // Grey-ish screen background
  pill: '#8EBBFF',       // Button background color
  text: '#5D8AC1',       // Muted dark blue text
};

export default function HomeScreen() {
  const menuOptions = [
    "Master Class",
    "Course",
    "Subject Entry",
    "Subject Allocation",
    "Student Entry",
    "Timetable Entry"
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {menuOptions.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.pill}
            activeOpacity={0.8}
          >
            <Text style={styles.pillText}>{item}</Text>
            <ArrowRight color={COLORS.text} size={28} strokeWidth={3} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Bottom Navigation */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <View style={styles.activeTabIndicator}>
            <Home color={COLORS.text} size={30} />
          </View>
          <User color={COLORS.text} size={30} />
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
    paddingBottom: 100, // Space for footer
  },
  pill: {
    backgroundColor: COLORS.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
  },
  pillText: {
    fontSize: 20,
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
  activeTabIndicator: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.text,
    paddingBottom: 2,
  }
});