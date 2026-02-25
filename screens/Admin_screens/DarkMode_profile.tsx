import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Menu, ArrowUp, ArrowDown, Home, UserCircle } from 'lucide-react-native';

const FacultyProfileScreen = () => {
  const [isDocsOpen, setIsDocsOpen] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header - */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Menu color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          
          {/* Profile Card Section - */}
          <View style={styles.profileCard}>
            <View style={styles.imagePlaceholder} />
            {/* Yahan faculty details (Name, ID etc.) aa sakti hain */}
          </View>

          {/* Documents Dropdown Section - */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.pill} 
              onPress={() => setIsDocsOpen(!isDocsOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>Documents</Text>
              {isDocsOpen ? (
                <ArrowUp color="#FFFFFF" size={24} /> 
              ) : (
                <ArrowDown color="#FFFFFF" size={24} />
              )}
            </TouchableOpacity>

            {isDocsOpen && (
              <View style={styles.dropdownContent}>
                <Text style={styles.infoText}>No documents uploaded yet.</Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* Bottom Nav - */}
        <View style={styles.footer}>
          <View style={styles.navBar}>
            <Home color="#888888" size={28} />
            <UserCircle color="#888888" size={28} />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default FacultyProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3F4E81',
  },
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
    fontSize: 20,
    fontWeight: '500',
  },
  body: {
    padding: 15,
    gap: 10,
  },
  profileCard: {
    backgroundColor: '#1E2139',
    borderRadius: 20,
    padding: 20,
    minHeight: 300,
    alignItems: 'flex-end', // Matches image_b97755.png image position
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
  },
  section: {
    marginTop: 10,
  },
  pill: {
    backgroundColor: '#4E6299',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 35,
    zIndex: 10,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  dropdownContent: {
    backgroundColor: '#1E2139',
    marginTop: -25,
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 250,
  },
  infoText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
});