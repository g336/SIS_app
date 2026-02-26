import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar 
} from 'react-native';
// CLI requires react-native-svg to be installed as a peer dependency for lucide
import { Menu, Home, User, ClipboardCheck, SquarePen, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function PYQScreen() {
  // Set to 'edit' to match your bottom nav design
  const [activeTab, setActiveTab] = useState<string>('edit'); 
  
  // 1. Corrected State: Define as an array of strings to allow multiple sems to open
  const [expandedSems, setExpandedSems] = useState<string[]>([]);

  // 2. Corrected Toggle Logic: Handles adding/removing items from the array
  const toggleSem = (sem: string): void => {
    if (expandedSems.includes(sem)) {
      // If already open, close it (remove from array)
      setExpandedSems(expandedSems.filter(item => item !== sem));
    } else {
      // If closed, open it (add to array)
      setExpandedSems([...expandedSems, sem]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 3. Added StatusBar for a consistent native look in CLI */}
      <StatusBar backgroundColor="#8EBBFF" barStyle="dark-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} activeOpacity={0.7}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PYQ's</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Accordion List */}
        {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'].map((sem) => {
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
              
              {/* Expanded Content Area */}
              {isExpanded && (
                <View style={styles.accordionContent}>
                  <Text style={styles.placeholderText}>Past Year Papers for {sem} will appear here.</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- FIXED NAV BAR --- */}
      <View style={styles.navWrapper}>
        <View style={styles.navBar}>
          {renderNavItem('edit', SquarePen, activeTab, setActiveTab)}
          {renderNavItem('home', Home, activeTab, setActiveTab)}
          {renderNavItem('profile', User, activeTab, setActiveTab)}
          {renderNavItem('result', ClipboardCheck, activeTab, setActiveTab)}
        </View>
      </View>
    </SafeAreaView>
  );
}

// 4. Helper function with explicit TypeScript types to satisfy CLI strict mode
const renderNavItem = (
  id: string, 
  Icon: any, 
  activeTab: string, 
  setActiveTab: (id: string) => void
) => {
  const isActive = activeTab === id;
  return (
    <TouchableOpacity onPress={() => setActiveTab(id)} style={styles.navItem}>
      <Icon color={isActive ? "#E2E8F0" : "#4A6FA5"} size={32} />
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CBD5E1' },
  header: { 
    height: 60, 
    backgroundColor: '#8EBBFF', 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 15 
  },
  menuIcon: { marginRight: 15 },
  headerTitle: { fontSize: 26, color: '#4A6FA5', fontWeight: '600' },
  scrollContent: { padding: 20, paddingTop: 30 },
  accordionContainer: { marginBottom: 20 },
  accordionHeader: { 
    backgroundColor: '#8EBBFF', 
    borderRadius: 30, 
    paddingVertical: 18,
    paddingHorizontal: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    zIndex: 2,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  accordionTitle: { color: '#4A6FA5', fontSize: 24 },
  accordionContent: { 
    backgroundColor: '#3B78C2', 
    minHeight: 150, 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    marginTop: -25, 
    paddingTop: 40,
    paddingHorizontal: 20,
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  placeholderText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 10 },
  navWrapper: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  navBar: { 
    flexDirection: 'row', 
    backgroundColor: '#8EBBFF', 
    width: '100%', 
    height: 70, 
    borderRadius: 40, 
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  activeIndicator: { position: 'absolute', bottom: 12, height: 3, width: 35, backgroundColor: '#E2E8F0', borderRadius: 2 },
});