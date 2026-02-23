import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',
  background: '#D1DCE8',
  pill: '#8EBBFF',
  contentBox: '#3E76B1', 
  text: '#5D8AC1',
};

export default function SemesterTimetable() {
  // Store multiple open states in an object
  const [openStates, setOpenStates] = useState({
    0: true, // Sem 1 open by default
    1: true  // Sem 2 open by default
  });

  const toggleSection = (index) => {
    setOpenStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const semesters = ["Sem 1", "Sem 2"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={28} />
        <Text style={styles.headerTitle}>Semester Timetable</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {semesters.map((sem, index) => {
          const isOpen = openStates[index];
          
          return (
            <View key={index} style={styles.accordionContainer}>
              <TouchableOpacity 
                activeOpacity={1}
                onPress={() => toggleSection(index)}
                style={[
                  styles.semesterPill,
                  isOpen && styles.pillOpen
                ]}
              >
                <Text style={[styles.pillText, isOpen && styles.underlineText]}>
                  {sem}
                </Text>
                {isOpen ? (
                  <ChevronUp color={COLORS.text} size={24} />
                ) : (
                  <ChevronDown color={COLORS.text} size={24} />
                )}
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.expandedBox}>
                  {/* Content area - No shadows applied here */}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNavPill}>
          <Home color={COLORS.text} size={28} />
          <View style={styles.userActiveIndicator}>
            <User color={COLORS.text} size={28} />
          </View>
        </View>
      </View>
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 15,
  },
  headerTitle: { 
    fontSize: 20, 
    color: COLORS.text, 
    fontWeight: '500' 
  },
  content: { 
    padding: 15, 
    gap: 15 
  },
  accordionContainer: {
    marginBottom: 5,
  },
  semesterPill: {
    backgroundColor: COLORS.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  pillOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pillText: { 
    fontSize: 18, 
    color: COLORS.text, 
    fontWeight: '500' 
  },
  underlineText: { 
    textDecorationLine: 'underline' 
  },
  expandedBox: {
    backgroundColor: COLORS.contentBox,
    height: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: -1,
    // Removed all shadow and elevation properties
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bottomNavPill: {
    backgroundColor: COLORS.header,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userActiveIndicator: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text,
    paddingBottom: 2,
  }
});