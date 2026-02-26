import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar 
} from 'react-native';
// CLI requires react-native-svg to render Lucide icons correctly
import { Menu, Home, User, ClipboardCheck, SquarePen, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function ProfileScreen() {
  // 1. Explicitly type state for CLI TypeScript consistency
  const [activeTab, setActiveTab] = useState<string>('profile'); 
  const [isDocExpanded, setIsDocExpanded] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* 2. Added StatusBar management for a native look */}
      <StatusBar backgroundColor="#8EBBFF" barStyle="dark-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Details Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.infoContainer}>
             <Text style={styles.infoTextMain}>Student Name</Text>
             <Text style={styles.infoTextSub}>Enrollment: 123456789</Text>
          </View>
        </View>

        {/* Documents Accordion */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => setIsDocExpanded(!isDocExpanded)}
            activeOpacity={0.9}
          >
            <Text style={styles.accordionTitle}>Documents</Text>
            {isDocExpanded ? (
              <ArrowUp color="#4A6FA5" size={26} strokeWidth={2.5} />
            ) : (
              <ArrowDown color="#4A6FA5" size={26} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
          
          {isDocExpanded && (
            <View style={styles.accordionContent}>
               <Text style={styles.placeholderText}>Verified documents will appear here.</Text>
            </View>
          )}
        </View>

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

// 3. Typed helper for Nav Items to clear "implicit any" errors
const renderNavItem = (
  id: string, 
  Icon: any, 
  activeTab: string, 
  setActiveTab: (id: string) => void, 
  isHome: boolean = false
) => {
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
  container: { flex: 1, backgroundColor: '#CBD5E1' },
  header: { 
    height: 60, backgroundColor: '#8EBBFF', flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 15 
  },
  menuIcon: { marginRight: 15 },
  headerTitle: { fontSize: 26, color: '#4A6FA5', fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingTop: 25 },

  profileCard: {
    backgroundColor: '#3B78C2', 
    height: 400, 
    borderRadius: 30, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 6,
  },
  avatarPlaceholder: {
    backgroundColor: '#CBD5E1', 
    width: 110, height: 110, 
    borderRadius: 25, 
    alignSelf: 'flex-end', 
  },
  infoContainer: { marginTop: 20 },
  infoTextMain: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  infoTextSub: { color: '#D1E5FF', fontSize: 18, marginTop: 5 },

  accordionContainer: { marginBottom: 20 },
  accordionHeader: { 
    backgroundColor: '#8EBBFF', borderRadius: 30, paddingVertical: 18,
    paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', zIndex: 2, elevation: 6,
  },
  accordionTitle: { color: '#4A6FA5', fontSize: 24 },
  accordionContent: { 
    backgroundColor: '#3B78C2', minHeight: 150, borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, marginTop: -25, paddingTop: 40, paddingHorizontal: 20,
    zIndex: 1, elevation: 4,
  },
  placeholderText: { color: 'white', textAlign: 'center', marginTop: 20 },

  navWrapper: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', backgroundColor: '#8EBBFF', width: '100%', height: 70, borderRadius: 40, alignItems: 'center', elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activeIndicator: { position: 'absolute', bottom: 12, height: 3, width: 35, backgroundColor: '#E2E8F0', borderRadius: 2 },
});