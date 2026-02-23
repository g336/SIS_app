import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react-native';

const COLORS = {
  header: '#82B7FF',       // Light blue header
  background: '#D1DCE8',   // Soft grayish-blue background
  pill: '#82B7FF',         // Blue pill color
  darkCard: '#3B6A9F',     // Darker blue for expanded Documents area
  text: '#3B6A9F',         // Dark blue text and placeholders
  whiteText: '#FFFFFF',
};

export default function UpdateProfileScreen() {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true); // Set to true to match the open state in your design

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.text} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Standard Name Input */}
        <View style={styles.inputPill}>
          <TextInput 
            placeholder="Name :" 
            placeholderTextColor={COLORS.text} 
            style={styles.inputText} 
          />
        </View>

        {/* Large Contact Input */}
        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput 
            placeholder="Contact :" 
            placeholderTextColor={COLORS.text} 
            style={styles.inputText} 
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Large Address Input */}
        <View style={[styles.inputPill, styles.largeInput]}>
          <TextInput 
            placeholder="Address :" 
            placeholderTextColor={COLORS.text} 
            style={styles.inputText} 
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>

        {/* Dynamic Documents Accordion */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => setIsDocumentsOpen(!isDocumentsOpen)}
            style={[styles.dropdownPill, isDocumentsOpen && styles.pillOpen]}
          >
            <Text style={styles.dropdownText}>Documents</Text>
            {isDocumentsOpen ? (
              <ChevronUp color={COLORS.text} size={30} strokeWidth={2.5} />
            ) : (
              <ChevronDown color={COLORS.text} size={30} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
          
          {/* Expanded Documents Content */}
          {isDocumentsOpen && (
            <View style={styles.expandedBox}>
              <Text style={styles.placeholderText}>No documents uploaded yet.</Text>
            </View>
          )}
        </View>

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
    padding: 20, 
    gap: 15, 
    paddingBottom: 50 
  },

  // Input Styles
  inputPill: { 
    backgroundColor: COLORS.pill, 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  largeInput: { 
    height: 150, 
    paddingTop: 15 
  },
  inputText: { 
    fontSize: 22, 
    color: COLORS.text, 
    fontFamily: 'serif',
    flex: 1
  },

  // Button Styles
  applyButton: { 
    backgroundColor: COLORS.pill, 
    paddingVertical: 16, 
    borderRadius: 30, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: { 
    fontSize: 22, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },

  // Accordion Styles
  accordionContainer: { 
    marginTop: 5 
  },
  dropdownPill: { 
    backgroundColor: COLORS.pill, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 25, 
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pillOpen: { 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    elevation: 0,
    shadowOpacity: 0
  },
  dropdownText: { 
    fontSize: 20, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },
  expandedBox: { 
    backgroundColor: COLORS.darkCard, 
    height: 120, // Match the visual height from the design
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    marginTop: -1,
    justifyContent: 'center',
  },
  placeholderText: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 16, 
    fontFamily: 'serif',
    textAlign: 'center'
  },
});