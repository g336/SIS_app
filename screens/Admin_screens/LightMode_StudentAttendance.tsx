
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronUp, ChevronDown, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',
  background: '#D1DCE8',
  pill: '#8EBBFF',
  expandedContent: '#3E76B1',
  text: '#5D8AC1',
};

export default function AttendanceScreen() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Student Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.accordionContainer}>
          {/* Attendance Header Pill */}
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => setIsOpen(!isOpen)}
            style={[
              styles.pill,
              isOpen && styles.pillOpen
            ]}
          >
            <Text style={styles.pillText}>Attendance</Text>
            {isOpen ? (
              <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
            ) : (
              <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
            )}
          </TouchableOpacity>

          {/* Dark Blue Content Box */}
          {isOpen && (
            <View style={styles.expandedBox}>
              {/* Data content goes here */}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={30} />
          <View style={styles.activeTabIndicator}>
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
    paddingBottom: 100,
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
  expandedBox: {
    backgroundColor: COLORS.expandedContent,
    height: 400, // Large height for attendance data
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1, // Merges the pill and the box
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