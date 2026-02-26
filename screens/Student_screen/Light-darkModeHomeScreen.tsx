import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, 
  ScrollView, Modal, Dimensions, StatusBar 
} from 'react-native';
import { Menu, Home, User, ClipboardCheck, SquarePen, ArrowDown, ArrowUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

// Define features
const APP_FEATURES = [
  { id: '1', title: 'Time Table', sub: 'Home', size: 'large', modalType: 'timetable', navigateTo: null },
  { id: '2', title: 'Attendance', size: 'large', modalType: 'attendance', navigateTo: null },
  { id: '3', title: 'YouTube\nPlaylist', size: 'small', modalType: 'youtube', navigateTo: null },
  { id: '4', title: 'Study\nMaterials', size: 'small', modalType: null, navigateTo: 'PYQ' }, // Set to navigate
];

export default function StudentHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState<string | null>(null); 
  const [expandedSem, setExpandedSem] = useState<string | null>(null);

  const toggleSem = (sem: string) => setExpandedSem(expandedSem === sem ? null : sem);

  const handlePress = (item: typeof APP_FEATURES[0]) => {
    if (item.navigateTo) {
      // @ts-ignore - navigation to PYQ screen
      navigation.navigate(item.navigateTo);
    } else if (item.modalType) {
      setActiveModal(item.modalType);
    }
  };

  const renderModalContent = () => {
    if (activeModal === 'attendance') {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.modalLabel}>Chart :</Text>
          <View style={styles.modalPlaceholder} />
          <Text style={styles.modalLabel}>Percentage :</Text>
          <View style={styles.modalPlaceholder} />
        </View>
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
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
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
      <StatusBar backgroundColor="#8EBBFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {APP_FEATURES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.8}
              onPress={() => handlePress(item)}
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
          <Text style={styles.collegeUpdatesText}>College Updates will appear here...</Text>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* DYNAMIC MODAL */}
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

      {/* FIXED NAV BAR - Note: In a real Tab Navigator, this would be handled by StudentTabs.tsx */}
      <View style={styles.navWrapper}>
        <View style={styles.navBar}>
          {renderNavItem('edit', SquarePen, activeTab, setActiveTab)}
          {renderNavItem('home', Home, activeTab, setActiveTab)}
          {renderNavItem('profile', User, activeTab, setActiveTab)}
          {renderNavItem('list', ClipboardCheck, activeTab, setActiveTab)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const renderNavItem = (id: string, Icon: any, activeTab: string, setActiveTab: (id: string) => void) => {
  const isActive = activeTab === id;
  return (
    <TouchableOpacity onPress={() => setActiveTab(id)} style={styles.navItem}>
      <Icon color={isActive ? "#E2E8F0" : "#4A6FA5"} size={32} />
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CBD5E1' },
  header: { height: 60, backgroundColor: '#8EBBFF', justifyContent: 'center', paddingHorizontal: 15 },
  scrollContent: { padding: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#B3D4FF', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  largeCard: { width: '100%', height: 180 },
  smallCard: { width: '48%', height: 130 },
  cardTitle: { color: '#4A6FA5', textAlign: 'center', fontWeight: '600' },
  largeTitle: { fontSize: 44 },
  smallTitle: { fontSize: 22 },
  cardUnderline: { height: 2, backgroundColor: '#4A6FA5', width: '70%', marginTop: 2 },
  subText: { color: '#4A6FA5', fontSize: 18, marginTop: 8 },
  updatesBox: { backgroundColor: '#3B78C2', borderRadius: 25, padding: 20, minHeight: 300, marginTop: 10 },
  updatesTitle: { color: '#D1E5FF', fontSize: 28, fontWeight: 'bold' },
  collegeUpdatesText: { color: '#D1E5FF', fontSize: 16, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: width * 0.85, height: height * 0.70, backgroundColor: '#80B3FF', borderRadius: 25, padding: 25, borderWidth: 2, borderColor: '#3B78C2' },
  fullModal: { width: width * 0.92, height: height * 0.80 },
  modalLabel: { fontSize: 24, color: '#4A6FA5', marginBottom: 10, fontWeight: 'bold' },
  modalPlaceholder: { backgroundColor: '#CBD5E1', borderRadius: 15, flex: 1, marginBottom: 15 },
  closeButton: { backgroundColor: '#3B78C2', borderRadius: 30, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  closeButtonText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  accordionHeader: { backgroundColor: '#3B78C2', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  accordionTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  accordionContent: { backgroundColor: '#CBD5E1', height: 100, borderRadius: 15, marginBottom: 10 },
  daysContainer: { maxHeight: 50, marginBottom: 10 },
  dayChip: { backgroundColor: '#3B78C2', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  dayChipText: { color: 'white', fontSize: 16 },
  navWrapper: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', backgroundColor: '#8EBBFF', width: '100%', height: 70, borderRadius: 35, alignItems: 'center', elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activeIndicator: { position: 'absolute', bottom: 10, height: 3, width: 30, backgroundColor: '#E2E8F0', borderRadius: 2 },
});