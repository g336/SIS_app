import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions 
} from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function YouTubeModal({ visible, onClose }) {
  // Array state to allow multiple accordions to be open at the same time
  const [expandedSems, setExpandedSems] = useState([]);

  const toggleSem = (sem) => {
    setExpandedSems((prev) => 
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  const SEMESTERS = ['Sem 1', 'Sem 2', 'Sem 3'];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          
          <Text style={styles.modalTitle}>Youtube Links:</Text>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {SEMESTERS.map((sem) => {
              const isExpanded = expandedSems.includes(sem);
              
              return (
                <View key={sem} style={styles.accordionContainer}>
                  {/* Accordion Header Pill */}
                  <TouchableOpacity 
                    style={styles.accordionHeader} 
                    onPress={() => toggleSem(sem)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.accordionTitle}>{sem}</Text>
                    {isExpanded ? (
                      <ArrowUp color="white" size={24} strokeWidth={2.5} />
                    ) : (
                      <ArrowDown color="white" size={24} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                  
                  {/* Expanded Content Area (Tucked under the header) */}
                  {isExpanded && (
                    <View style={styles.accordionContent}>
                      {/* Add your YouTube video links/thumbnails here */}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalView: { 
    width: width * 0.85, 
    height: height * 0.75, 
    backgroundColor: '#80B3FF', // Light blue background matching mockup
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 2, 
    borderColor: '#3B78C2',
  },
  modalTitle: { 
    fontSize: 28, 
    color: '#4A6FA5', 
    fontFamily: 'serif', 
    marginBottom: 20 
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Accordion Styles
  accordionContainer: { 
    marginBottom: 20 
  },
  accordionHeader: { 
    backgroundColor: '#3B78C2', // Darker blue pill
    borderRadius: 30, 
    paddingVertical: 15,
    paddingHorizontal: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    zIndex: 2, // Keeps header above the content box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  accordionTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontFamily: 'serif' 
  },
  accordionContent: { 
    backgroundColor: '#CBD5E1', // Light grey/blue placeholder
    height: 180, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    marginTop: -25, // Pulls the box up to tuck underneath the pill header
    paddingTop: 35, // Adds space inside so content isn't covered by the header
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  // Close Button
  closeButton: { 
    backgroundColor: '#3B78C2', 
    borderRadius: 30, 
    paddingVertical: 12, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 24, 
    fontFamily: 'serif' 
  },
});