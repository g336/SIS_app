import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Modal 
} from 'react-native';
import { Menu, ArrowDown, ArrowUp, Check } from 'lucide-react-native';

export default function UpdateProfileScreen() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [isDocExpanded, setIsDocExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TextInput 
          style={styles.inputField} 
          placeholder="Name :" 
          placeholderTextColor="#4A6FA5"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput 
          style={[styles.inputField, styles.textArea]} 
          placeholder="Contact :" 
          placeholderTextColor="#4A6FA5"
          multiline={true}
          value={contact}
          onChangeText={setContact}
        />
        
        <TextInput 
          style={[styles.inputField, styles.textArea]} 
          placeholder="Address :" 
          placeholderTextColor="#4A6FA5"
          multiline={true}
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={() => setModalVisible(true)} 
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>

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
            <View style={styles.accordionContent} />
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>Profile Update Request</Text>
              <Text style={styles.modalText}>Sent Successfully</Text>
              <View style={styles.successIconWrapper}>
                <Check color="white" size={32} strokeWidth={3} />
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
  scrollContent: { padding: 25, paddingTop: 30 },
  inputField: {
    backgroundColor: '#8EBBFF',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 18,
    fontSize: 20,
    fontFamily: 'serif',
    color: '#4A6FA5',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  applyButton: {
    backgroundColor: '#8EBBFF',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  applyButtonText: {
    color: '#4A6FA5',
    fontSize: 22,
    fontFamily: 'serif',
  },
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
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 5, elevation: 6,
  },
  accordionTitle: { color: '#4A6FA5', fontSize: 22, fontFamily: 'serif' },
  accordionContent: { 
    backgroundColor: '#3B78C2', 
    height: 200, 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    marginTop: -25, 
    paddingTop: 40, 
    zIndex: 1, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#3B78C2', 
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTextContainer: {
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'serif',
    textAlign: 'center',
    lineHeight: 30,
  },
  successIconWrapper: {
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#8EBBFF',
    borderRadius: 30,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButtonText: {
    color: '#4A6FA5',
    fontSize: 22,
    fontFamily: 'serif',
  }
});