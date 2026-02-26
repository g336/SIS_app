import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions 
} from 'react-native';
// CLI requires react-native-svg to be installed as a peer dependency for lucide
import { ArrowDown, ArrowUp } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// 1. Define types for the props to fix "implicit any" errors
interface YouTubeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function YouTubeModal({ visible, onClose }: YouTubeModalProps) {
  // 2. Explicitly type the state as a string array to fix the 'never[]' error
  const [expandedSems, setExpandedSems] = useState<string[]>([]);

  // 3. Add type 'string' to the sem parameter
  const toggleSem = (sem: string) => {
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
                  
                  {/* Expanded Content Area */}
                  {isExpanded && (
                    <View style={styles.accordionContent}>
                      <Text style={styles.placeholderText}>
                        Video links for {sem} will appear here.
                      </Text>
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
    backgroundColor: '#80B3FF', 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 2, 
    borderColor: '#3B78C2',
  },
  modalTitle: { 
    fontSize: 28, 
    color: '#4A6FA5', 
    marginBottom: 20 
  },
  scrollContent: {
    paddingBottom: 20,
  },
  accordionContainer: { 
    marginBottom: 20 
  },
  accordionHeader: { 
    backgroundColor: '#3B78C2', 
    borderRadius: 30, 
    paddingVertical: 15,
    paddingHorizontal: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    zIndex: 2, 
    elevation: 6,
  },
  accordionTitle: { 
    color: 'white', 
    fontSize: 22, 
  },
  accordionContent: { 
    backgroundColor: '#CBD5E1', 
    minHeight: 150, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    marginTop: -25, 
    paddingTop: 35, 
    paddingHorizontal: 15,
    zIndex: 1,
    elevation: 4,
  },
  placeholderText: {
    color: '#4A6FA5',
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: { 
    backgroundColor: '#3B78C2', 
    borderRadius: 30, 
    paddingVertical: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 6,
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 24, 
  },
});