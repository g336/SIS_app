import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, 
  ScrollView, Modal, Dimensions 
} from 'react-native';
import { Menu, Home, User, ClipboardCheck, SquarePen, ArrowDown, ArrowUp } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const APP_FEATURES = [
  { id: '1', title: 'Time Table', sub: 'Home', size: 'large', modalType: 'timetable' },
  { id: '2', title: 'Attendance', size: 'large', modalType: 'attendance' },
  { id: '3', title: 'YouTube\nPlaylist', size: 'small', modalType: 'youtube' },
  { id: '4', title: 'Study\nMaterials', size: 'small', modalType: null },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState(null); 
  const [expandedSem, setExpandedSem] = useState(null);

  const toggleSem = (sem) => setExpandedSem(expandedSem === sem ? null : sem);

  // --- MODAL CONTENTS ---
  const renderModalContent = () => {
    if (activeModal === 'attendance') {
      return (
        <>
          <Text style={styles.modalLabel}>Chart :</Text>
          <View style={styles.modalPlaceholder} />
          <Text style={styles.modalLabel}>Percentage :</Text>
          <View style={styles.modalPlaceholder} />
        </>
      );
    }
    
    if (activeModal === 'youtube') {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalLabel}>Youtube Links:</Text>
          {['Sem 1', 'Sem 2', 'Sem 3'].map((sem) => (
            <View key={sem}>
              <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSem(sem)}>
                <Text style={styles.accordionTitle}>{sem}</Text>
                {expandedSem === sem ? <ArrowUp color="white" size={20} /> : <ArrowDown color="white" size={20} />}
              </TouchableOpacity>
              {expandedSem === sem && <View style={styles.accordionContent} />}
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeModal === 'timetable') {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.modalLabel}>TimeTable:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <TouchableOpacity key={day} style={styles.dayChip}>
                <Text style={styles.dayChipText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={[styles.modalPlaceholder, { flex: 1, marginTop: 10 }]} />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {APP_FEATURES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.8}
              onPress={() => item.modalType && setActiveModal(item.modalType)}
              style={[styles.card, item.size === 'small' ? styles.smallCard : styles.largeCard]}
            >
              <Text style={[styles.cardTitle, item.size === 'small' ? styles.smallTitle : styles.largeTitle]}>
                {item.title}
              </Text>
              <View style={styles.cardUnderline} />
              {item.sub && <Text style={styles.subText}>{item.sub}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.updatesBox}>
          <Text style={styles.updatesTitle}>Updates :</Text>
          <Text style={styles.collegeUpdatesText}>College Updates</Text>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* --- DYNAMIC MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={!!activeModal} onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, activeModal === 'timetable' && styles.fullModal]}>
            
            {renderModalContent()}

            <TouchableOpacity style={styles.closeButton} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- FIXED NAV BAR --- */}
      <View style={styles.navWrapper}>
        <View style={styles.navBar}>
          {renderNavItem('edit', SquarePen, activeTab, setActiveTab)}
          {renderNavItem('home', Home, activeTab, setActiveTab, true)}
          {renderNavItem('profile', User, activeTab, setActiveTab)}
          {renderNavItem('list', ClipboardCheck, activeTab, setActiveTab)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const renderNavItem = (id, Icon, activeTab, setActiveTab, isHome = false) => {
  const isActive = activeTab === id;
  return (
    <TouchableOpacity onPress={() => setActiveTab(id)} style={styles.navItem}>
      <Icon color={isActive ? "#E2E8F0" : "#4A6FA5"} size={32} fill={isHome && isActive ? "#E2E8F0" : "transparent"} />
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CBD5E1' },
  header: { height: 60, backgroundColor: '#8EBBFF', justifyContent: 'center', paddingHorizontal: 15 },
  scrollContent: { padding: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  card: { backgroundColor: '#B3D4FF', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  largeCard: { width: '100%', height: 180 },
  smallCard: { width: '48%', height: 130 },
  cardTitle: { color: '#4A6FA5', fontFamily: 'serif', textAlign: 'center' },
  largeTitle: { fontSize: 48 },
  smallTitle: { fontSize: 22 },
  cardUnderline: { height: 2, backgroundColor: '#4A6FA5', width: '75%', marginTop: 2 },
  subText: { color: '#4A6FA5', fontSize: 20, fontFamily: 'serif', marginTop: 10 },
  
  updatesBox: { backgroundColor: '#3B78C2', borderRadius: 25, padding: 20, height: 450, marginTop: 10 },
  updatesTitle: { color: '#D1E5FF', fontSize: 28, fontFamily: 'serif' },
  collegeUpdatesText: { color: '#D1E5FF', fontSize: 14, fontFamily: 'serif', marginTop: 10 },

  // Shared Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: width * 0.85, height: height * 0.75, backgroundColor: '#80B3FF', borderRadius: 15, padding: 20, borderWidth: 3, borderColor: '#3B78C2' },
  fullModal: { width: width * 0.95, height: height * 0.85 }, // Slightly larger for timetable
  modalLabel: { fontSize: 26, color: '#4A6FA5', fontFamily: 'serif', marginBottom: 10 },
  modalPlaceholder: { backgroundColor: '#CBD5E1', borderRadius: 20, flex: 1, marginBottom: 15, minHeight: 120 },
  closeButton: { backgroundColor: '#3B78C2', borderRadius: 30, paddingVertical: 12, alignItems: 'center', marginTop: 10, elevation: 6 },
  closeButtonText: { color: 'white', fontSize: 24, fontFamily: 'serif' },

  // YouTube Accordion
  accordionHeader: { backgroundColor: '#3B78C2', borderRadius: 20, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  accordionTitle: { color: 'white', fontSize: 20, fontFamily: 'serif' },
  accordionContent: { backgroundColor: '#CBD5E1', height: 150, borderRadius: 20, marginBottom: 10 },

  // TimeTable Chips
  daysContainer: { maxHeight: 50, marginBottom: 10 },
  dayChip: { backgroundColor: '#3B78C2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginRight: 10, justifyContent: 'center' },
  dayChipText: { color: 'white', fontSize: 18, fontFamily: 'serif' },

  // Nav
  navWrapper: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', backgroundColor: '#8EBBFF', width: '100%', height: 70, borderRadius: 40, alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  activeIndicator: { position: 'absolute', bottom: 12, height: 3, width: 35, backgroundColor: '#E2E8F0', borderRadius: 2 },
});