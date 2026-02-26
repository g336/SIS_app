import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Modal, StatusBar 
} from 'react-native';
// CLI requires react-native-svg to be installed as a peer dependency for lucide
import { Menu, ArrowDown, ArrowUp, Check } from 'lucide-react-native';

export default function LeaveRequestScreen() {
  const [isReportExpanded, setIsReportExpanded] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Form states
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleApply = (): void => {
    // Show the success modal when Apply is clicked
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Added StatusBar management for CLI consistency */}
      <StatusBar backgroundColor="#8EBBFF" barStyle="dark-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Request</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Form Inputs */}
        <TextInput 
          style={styles.inputField} 
          placeholder="From :" 
          placeholderTextColor="#4A6FA5"
          value={from}
          onChangeText={setFrom}
        />
        <TextInput 
          style={styles.inputField} 
          placeholder="To :" 
          placeholderTextColor="#4A6FA5"
          value={to}
          onChangeText={setTo}
        />
        <TextInput 
          style={styles.inputField} 
          placeholder="Time :" 
          placeholderTextColor="#4A6FA5"
          value={time}
          onChangeText={setTime}
        />
        <TextInput 
          style={[styles.inputField, styles.textArea]} 
          placeholder="Reason :" 
          placeholderTextColor="#4A6FA5"
          multiline={true}
          value={reason}
          onChangeText={setReason}
        />

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>

        {/* Leave Report Accordion */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => setIsReportExpanded(!isReportExpanded)}
            activeOpacity={0.9}
          >
            <Text style={styles.accordionTitle}>Leave report</Text>
            {isReportExpanded ? (
              <ArrowUp color="#4A6FA5" size={26} strokeWidth={2.5} />
            ) : (
              <ArrowDown color="#4A6FA5" size={26} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
          
          {isReportExpanded && (
            <View style={styles.accordionContent}>
               <Text style={styles.placeholderText}>Past leave reports will appear here.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- SUCCESS MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>Leave Request sent</Text>
              <View style={styles.successRow}>
                <Text style={styles.modalText}>Successfully </Text>
                <Check color="white" size={28} strokeWidth={3} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CBD5E1' },
  header: { 
    height: 60, backgroundColor: '#8EBBFF', flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 15 
  },
  menuIcon: { marginRight: 15 },
  headerTitle: { fontSize: 26, color: '#4A6FA5', fontWeight: 'bold' },
  scrollContent: { padding: 25, paddingTop: 30 },

  // Form Inputs
  inputField: {
    backgroundColor: '#8EBBFF',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 18,
    fontSize: 20,
    color: '#4A6FA5',
    marginBottom: 15,
    elevation: 3,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

  // Apply Button
  applyButton: {
    backgroundColor: '#8EBBFF',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 5,
  },
  applyButtonText: { color: '#4A6FA5', fontSize: 22, fontWeight: 'bold' },

  // Accordion Styles
  accordionContainer: { marginBottom: 20 },
  accordionHeader: { 
    backgroundColor: '#8EBBFF', borderRadius: 30, paddingVertical: 18,
    paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', zIndex: 2, elevation: 6,
  },
  accordionTitle: { color: '#4A6FA5', fontSize: 22 },
  accordionContent: { 
    backgroundColor: '#3B78C2', minHeight: 150, borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, marginTop: -25, paddingTop: 40, paddingHorizontal: 20,
    zIndex: 1, elevation: 4,
  },
  placeholderText: { color: 'white', textAlign: 'center', marginTop: 20 },

  // Modal Styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalView: {
    width: '85%', backgroundColor: '#3B78C2', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10,
  },
  modalTextContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  successRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  modalText: { color: 'white', fontSize: 24, textAlign: 'center' },
  closeButton: {
    backgroundColor: '#8EBBFF', borderRadius: 30, paddingVertical: 15, width: '100%', alignItems: 'center', elevation: 4,
  },
  closeButtonText: { color: '#4A6FA5', fontSize: 22, fontWeight: 'bold' },
});