import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Menu, ArrowDown, ArrowUp, Home, UserCircle } from 'lucide-react-native';

const SemesterTTScreen = () => {
  // Simple state: 0 matlab sab band, 1 matlab Sem 1 khula, 2 matlab Sem 2
  const [open, setOpen] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color="#FFFFFF" size={28} />
        <Text style={styles.headerTitle}>Semester Timetable</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        
        {/* SEMESTER 1 SECTION */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.pill} 
            onPress={() => setOpen(open === 1 ? 0 : 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillText}>Sem 1</Text>
            {open === 1 ? <ArrowUp color="#FFF" /> : <ArrowDown color="#FFF" />}
          </TouchableOpacity>
          
          {open === 1 && (
            <View style={styles.dropdown}>
              <Text style={styles.info}>Semester 1 Timetable Content</Text>
            </View>
          )}
        </View>

        {/* SEMESTER 2 SECTION */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.pill} 
            onPress={() => setOpen(open === 2 ? 0 : 2)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillText}>Sem 2</Text>
            {open === 2 ? <ArrowUp color="#FFF" /> : <ArrowDown color="#FFF" />}
          </TouchableOpacity>

          {open === 2 && (
            <View style={styles.dropdown}>
              <Text style={styles.info}>Semester 2 Timetable Content</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.footer}>
        <View style={styles.navBar}>
          <Home color="#4DA8FF" size={28} />
          <UserCircle color="#888888" size={28} />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Pura screen default export kar raha hoon
export default SemesterTTScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11121E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3F4E81',
    gap: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  body: {
    padding: 20,
  },
  section: {
    marginBottom: 15,
  },
  pill: {
    backgroundColor: '#4E6299',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    zIndex: 2,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#1E2139',
    marginTop: -20, // Slide under effect
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 150,
  },
  info: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: '#11121E',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E2139',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
});