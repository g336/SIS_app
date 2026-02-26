import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, 
  ScrollView, StatusBar 
} from 'react-native';
// CLI requires react-native-svg to be installed as a peer dependency for lucide
import { Menu, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function AttendanceScreen() {
  // 1. Explicitly type the state as an array of strings to fix the 'never[]' error
  const [expandedSems, setExpandedSems] = useState<string[]>([]);

  // 2. Add type 'string' to the sem parameter
  const toggleSem = (sem: string) => {
    setExpandedSems((prev) => 
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 3. Added StatusBar for a consistent CLI look */}
      <StatusBar backgroundColor="#8EBBFF" barStyle="dark-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'].map((sem) => {
          const isExpanded = expandedSems.includes(sem);
          
          return (
            <View key={sem} style={styles.accordionContainer}>
              {/* Accordion Pill */}
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
                  <Text style={styles.placeholderText}>Attendance data for {sem} will load here.</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
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
  headerTitle: { fontSize: 26, color: '#4A6FA5' },
  scrollContent: { padding: 20, paddingTop: 30 },

  accordionContainer: { marginBottom: 20 },
  accordionHeader: { 
    backgroundColor: '#8EBBFF', borderRadius: 30, paddingVertical: 18,
    paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', zIndex: 2, 
    elevation: 6,
  },
  accordionTitle: { color: '#4A6FA5', fontSize: 24 },
  accordionContent: { 
    backgroundColor: '#3B78C2', minHeight: 150, borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, marginTop: -25, paddingTop: 40, paddingHorizontal: 20,
    zIndex: 1, elevation: 4,
  },
  placeholderText: { color: 'white', textAlign: 'center', marginTop: 20, fontSize: 16 }
});