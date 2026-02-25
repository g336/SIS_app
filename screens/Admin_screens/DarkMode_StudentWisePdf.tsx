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

const SemesterPdfScreen = () => {
  // State: 0 (Closed), 1 (Sem 1 open), 2 (Sem 2 open)
  const [open, setOpen] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {/* Header - Image: image_aa8db8.png */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Menu color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Semester Wise Pdf</Text>
        </View>

        {/* Scrollable List */}
        <ScrollView contentContainerStyle={styles.body}>
          
          {/* SEMESTER 1 SECTION */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => setOpen(open === 1 ? 0 : 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Sem 1</Text>
              {open === 1 ? <ArrowUp color="#FFF" size={24} /> : <ArrowDown color="#FFF" size={24} />}
            </TouchableOpacity>

            {/* Expanded PDF List - image_aa8db8.png */}
            {open === 1 && (
              <View style={styles.dropdown}>
                <Text style={styles.emptyText}>No PDF files available for Sem 1</Text>
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
              {open === 2 ? <ArrowUp color="#FFF" size={24} /> : <ArrowDown color="#FFF" size={24} />}
            </TouchableOpacity>

            {/* Expanded PDF List */}
            {open === 2 && (
              <View style={styles.dropdown}>
                <Text style={styles.emptyText}>No PDF files available for Sem 2</Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.footer}>
          <View style={styles.navBar}>
            <TouchableOpacity>
              <Home color="#4DA8FF" size={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <UserCircle color="#888888" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Default export as requested
export default SemesterPdfScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3F4E81',
  },
  mainContainer: {
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
    gap: 15,
  },
  section: {
    width: '100%',
  },
  pill: {
    backgroundColor: '#4E6299',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    zIndex: 2,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  dropdown: {
    backgroundColor: '#1E2139',
    marginTop: -25,
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 150,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 14,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
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