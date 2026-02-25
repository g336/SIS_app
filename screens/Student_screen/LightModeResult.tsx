import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView 
} from 'react-native';
import { Menu, Home, User, ClipboardCheck, SquarePen, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function ResultScreen() {
  // Sets the 4th tab as active to match your design
  const [activeTab, setActiveTab] = useState('result'); 
  const [expandedSem, setExpandedSem] = useState(null);

  const toggleSem = (sem) => {
    setExpandedSem(expandedSem === sem ? null : sem);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Accordion List for Semesters */}
        {['Sem 1', 'Sem 2'].map((sem) => (
          <View key={sem}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => toggleSem(sem)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>{sem}</Text>
              {expandedSem === sem ? (
                <ArrowUp color="#4A6FA5" size={26} strokeWidth={2.5} />
              ) : (
                <ArrowDown color="#4A6FA5" size={26} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
            
            {/* Expanded Content Area */}
            {expandedSem === sem && (
              <View style={styles.accordionContent}>
                <Text style={styles.placeholderText}>Result details for {sem} will appear here.</Text>
              </View>
            )}
          </View>
        ))}

        {/* Spacer so content doesn't get blocked by the fixed nav bar */}
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
  menuIcon: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 26,
    color: '#4A6FA5',
    fontFamily: 'serif',
  },
  scrollContent: { 
    padding: 20,
    paddingTop: 30,
  },

  // Accordion Styles
  accordionHeader: { 
    backgroundColor: '#8EBBFF', 
    borderRadius: 30, 
    paddingVertical: 18,
    paddingHorizontal: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15,
    // Drop shadow matching the image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  accordionTitle: { 
    color: '#4A6FA5', 
    fontSize: 24, 
    fontFamily: 'serif' 
  },
  accordionContent: { 
    backgroundColor: '#A3C4F3', 
    minHeight: 120, 
    borderRadius: 20, 
    marginBottom: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#4A6FA5',
    fontFamily: 'serif',
    fontSize: 16,
  },

  // Fixed Nav Bar Styles
  navWrapper: { 
    position: 'absolute', 
    bottom: 25, 
    width: '100%', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },
  navBar: { 
    flexDirection: 'row', 
    backgroundColor: '#8EBBFF', 
    width: '100%', 
    height: 70, 
    borderRadius: 40, 
    alignItems: 'center' 
  },
  navItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%' 
  },
  activeIndicator: { 
    position: 'absolute', 
    bottom: 12, 
    height: 3, 
    width: 35, 
    backgroundColor: '#E2E8F0', 
    borderRadius: 2 
  },
});