import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView 
} from 'react-native';
import { Menu, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function AttendanceScreen() {
  // Array allows multiple accordions to be open at the same time
  const [expandedSems, setExpandedSems] = useState([]);

  const toggleSem = (sem) => {
    setExpandedSems((prev) => 
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
      </View>

      {/* --- SCROLLABLE BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {['Sem 1', 'Sem 2'].map((sem) => {
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
              
              {/* Expanded Content Area (Tucked underneath the pill) */}
              {isExpanded && (
                <View style={styles.accordionContent}>
                  {/* Real attendance charts/data would go here */}
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
  headerTitle: { fontSize: 26, color: '#4A6FA5', fontFamily: 'serif' },
  scrollContent: { padding: 20, paddingTop: 30 },

  accordionContainer: { marginBottom: 20 },
  accordionHeader: { 
    backgroundColor: '#8EBBFF', borderRadius: 30, paddingVertical: 18,
    paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', zIndex: 2, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 5, elevation: 6,
  },
  accordionTitle: { color: '#4A6FA5', fontSize: 24, fontFamily: 'serif' },
  accordionContent: { 
    backgroundColor: '#3B78C2', height: 300, borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, marginTop: -25, paddingTop: 40, 
    zIndex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 4,
  },
});