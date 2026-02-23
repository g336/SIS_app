import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF',     // Light blue header
  background: '#D1DCE8', // Grey-ish background
  pill: '#8EBBFF',       // Selection pill color
  darkCard: '#3E76B1',   // Dark blue profile card and expanded area
  profileImg: '#D1DCE8', // Placeholder color for profile image
  text: '#5D8AC1',       // Primary muted blue text
};

export default function ProfileScreen() {
  const [isDocsOpen, setIsDocsOpen] = useState(false); // Dynamic state for documents dropdown

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.imageContainer}>
             <View style={styles.profileImagePlaceholder} />
          </View>
          {/* Profile details are contained within this dark area */}
        </View>

        {/* Dynamic Documents Dropdown Section */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            style={[styles.dropdownPill, isDocsOpen && styles.pillOpen]} 
            activeOpacity={0.9}
            onPress={() => setIsDocsOpen(!isDocsOpen)}
          >
            <Text style={styles.pillText}>Documents</Text>
            {isDocsOpen ? (
              <ChevronUp color={COLORS.text} size={28} strokeWidth={3} />
            ) : (
              <ChevronDown color={COLORS.text} size={28} strokeWidth={3} />
            )}
          </TouchableOpacity>

          {/* Expanded Dark Blue Content Area */}
          {isDocsOpen && (
            <View style={styles.expandedBox}>
               {/* Document content or list goes here */}
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
    gap: 20,
  },
  profileCard: {
    backgroundColor: COLORS.darkCard,
    height: 380, // Large profile card area
    borderRadius: 35,
    padding: 20,
    elevation: 4, // Subtle shadow for depth
  },
  imageContainer: {
    alignItems: 'flex-end', // Aligns user photo to the right
  },
  profileImagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: COLORS.profileImg,
    borderRadius: 20, // Rounded square image
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
    height: 300, // Area for expanded document content
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -1, // Connects pill and box seamlessly
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