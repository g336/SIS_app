import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView 
} from 'react-native';
import { Menu, Home, User, ClipboardCheck, SquarePen, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function PYQScreen() {
  // Set to 'edit' (the first icon) to match your design
  const [activeTab, setActiveTab] = useState('edit'); 
  
  // Using an array so multiple semesters can be expanded at once
  const [expandedSems, setExpandedSems] = useState([]);

  const toggleSem = (sem) => {
    setExpandedSems((prev) => 
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PYQ's</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Accordion List */}
        {['Sem 1', 'Sem 2'].map((sem) => {
          const isExpanded = expandedSems.includes(sem);
          
          return (
            <View key={sem} style={styles.accordionContainer}>
              {/* Accordion Header */}
              <TouchableOpacity 
                style={styles.accordionHeader} 
                onPress={() => toggleSem(sem)}
                activeOpacity={0.9}
              >
                <Text style={styles.accordionTitle}>{sem}</Text>
                {isExpanded ? (
                  <ArrowUp color="#4A6FA5" size={26} strokeWidth={2.5} />
                ) : (
                  <ArrowDown color="#4A6FA5" size={26} strokeWidth={2.5} />
                )}
              </TouchableOpacity>
              
              {/* Expanded Content Area (Tucked slightly under the header for the shadow effect) */}
              {isExpanded && (
                <View style={styles.accordionContent}>
                  {/* Content goes here */}
                </View>
              )}
            </View>
          );
        })}

        {/* Spacer to prevent content from hiding behind fixed nav bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- FIXED NAV BAR --- */}
      <View style={styles.navWrapper}>
        <View style={styles.navBar}>
          {renderNavItem('edit', SquarePen, activeTab, setActiveTab)}
          {renderNavItem('home', Home, activeTab, setActiveTab, true)}
          {renderNavItem('profile', User, activeTab, setActiveTab)}
          {renderNavItem('result', ClipboardCheck, activeTab, setActiveTab)}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Helper for Nav Items
const renderNavItem = (id, Icon, activeTab, setActiveTab, isHome = false) => {
  const isActive = activeTab === id;
  return (
    <TouchableOpacity onPress={() => setActiveTab(id)} style={styles.navItem}>
      <Icon 
        color={isActive ? "#E2E8F0" : "#4A6FA5"} 
        size={32} 
        fill={isHome && isActive ? "#E2E8F0" : "transparent"} 
      />
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#CBD5E1' 
  },
  header: { 
    height: 60, 
    backgroundColor: '#8EBBFF', 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 15 
  },
  menuIcon: { marginRight: 15 },
  headerTitle: { fontSize: 26, color: '#4A6FA5', fontFamily: 'serif' },
  scrollContent: { padding: 20, paddingTop: 30 },

  // Accordion Styles
  accordionContainer: {
    marginBottom: 20,
  },
  accordionHeader: { 
    backgroundColor: '#8EBBFF', 
    borderRadius: 30, 
    paddingVertical: 18,
    paddingHorizontal: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    zIndex: 2, // Keeps header above the dark blue box so the shadow casts over it
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  accordionTitle: { 
    color: '#4A6FA5', 
    fontSize: 24, 
    fontFamily: 'serif' 
  },
  accordionContent: { 
    backgroundColor: '#3B78C2', // Dark blue from the image
    height: 300, // Tall placeholder box
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    marginTop: -25, // Pulls the box up to tuck underneath the pill header
    paddingTop: 40, // Adds space inside so content isn't covered by the header
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  // Fixed Nav Bar Styles
  navWrapper: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', backgroundColor: '#8EBBFF', width: '100%', height: 70, borderRadius: 40, alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  activeIndicator: { position: 'absolute', bottom: 12, height: 3, width: 35, backgroundColor: '#E2E8F0', borderRadius: 2 },
});