import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, Book, Home, User, FileText } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',       // Light blue header
  background: '#D1DCE8',   // Soft grayish-blue background
  darkBlue: '#3B6A9F',     // Dark blue for day pills and main content area
  text: '#3B6A9F',         // Dark blue text for header
  whiteText: '#FFFFFF',    // White text for inner content
};

export default function LectureScreen() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Lecture</Text>
      </View>

      {/* Horizontal Day Selector */}
      <View style={styles.daySelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollDays}>
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayPill, 
                selectedDay === day && styles.activeDayPill // Optional: Add active state styling here if needed
              ]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.8}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContentArea}>
        <ScrollView contentContainerStyle={styles.innerScrollContent}>
          {/* Dynamic content for the selected day will go here */}
          <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 20 }}>
            No lectures scheduled for {selectedDay}.
          </Text>
        </ScrollView>
      </View>

      {/* Floating Navigation Bar */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Book color={COLORS.whiteText} size={28} strokeWidth={2.5} />
          <Home color={COLORS.darkBlue} size={32} strokeWidth={2.5} />
          <User color={COLORS.darkBlue} size={28} strokeWidth={2.5} />
          <FileText color={COLORS.whiteText} size={28} strokeWidth={2.5} />
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
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    gap: 15 
  },
  headerTitle: { 
    fontSize: 26, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },
  
  // Day Selector Styles
  daySelectorContainer: {
    paddingVertical: 15,
  },
  scrollDays: {
    paddingHorizontal: 15,
    gap: 12,
  },
  dayPill: {
    backgroundColor: COLORS.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  activeDayPill: {
    // You can add a subtle border or opacity change to indicate the selected day
    borderColor: COLORS.whiteText,
    borderWidth: 1,
  },
  dayText: {
    color: COLORS.whiteText,
    fontSize: 20,
    fontFamily: 'serif',
  },

  // Main Content Styles
  mainContentArea: {
    flex: 1,
    backgroundColor: COLORS.darkBlue,
    marginHorizontal: 15,
    marginBottom: 0, // Extends down behind the footer
    borderTopLeftRadius: 5, // Slight rounding as seen in the image
    borderTopRightRadius: 5,
  },
  innerScrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding to scroll past the floating footer
  },

  // Footer Styles
  footerWrapper: { 
    position: 'absolute', 
    bottom: 25, 
    left: 20, 
    right: 20 
  },
  footerPill: { 
    backgroundColor: COLORS.header, 
    height: 60, 
    borderRadius: 30, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});