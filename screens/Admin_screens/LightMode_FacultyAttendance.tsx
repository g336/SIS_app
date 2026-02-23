import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Menu, ChevronDown, ChevronUp, Home, User } from 'lucide-react-native';

const COLORS = {
  header: '#8EBBFF', background: '#D1DCE8', pill: '#8EBBFF',
  darkCard: '#3E76B1', text: '#5D8AC1', white: '#FFFFFF'
};

export default function App() {
  // Added state to toggle the attendance drawer open and close
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(true);

  const attendanceData = [
    { date: '10 Oct 2023', status: 'Present' },
    { date: '11 Oct 2023', status: 'Present' },
    { date: '12 Oct 2023', status: 'Absent' },
    { date: '13 Oct 2023', status: 'Present' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Menu color={COLORS.text} size={30} />
        <Text style={styles.headerTitle}>Faculty Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.accordionContainer}>
          
          {/* Tappable Header to Open/Close Drawer */}
          <TouchableOpacity 
            style={[styles.dropdownPill, isAttendanceOpen && styles.pillOpen]} 
            activeOpacity={0.9}
            onPress={() => setIsAttendanceOpen(!isAttendanceOpen)}
          >
            <Text style={styles.pillText}>Attendance</Text>
            {isAttendanceOpen ? (
              <ChevronUp color={COLORS.text} size={28} />
            ) : (
              <ChevronDown color={COLORS.text} size={28} />
            )}
          </TouchableOpacity>
          
          {/* Conditionally Rendered Content Box */}
          {isAttendanceOpen && (
            <View style={styles.expandedBoxResult}>
              <ScrollView nestedScrollEnabled style={styles.listContainer}>
                {attendanceData.map((item, index) => (
                  <View key={index} style={styles.recordRow}>
                    <Text style={styles.recordText}>{item.date}</Text>
                    <Text style={[
                      styles.recordText, 
                      { color: item.status === 'Absent' ? '#FF6B6B' : '#4CAF50' }
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          
        </View>
      </ScrollView>

      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Home color={COLORS.text} size={30} />
          <User color={COLORS.text} size={30} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, padding: 15, gap: 15 },
  headerTitle: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  dropdownPill: { backgroundColor: COLORS.pill, flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 30 },
  pillOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  pillText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  accordionContainer: { marginBottom: 5 },
  expandedBoxResult: { backgroundColor: COLORS.darkCard, height: 450, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: -1 },
  listContainer: { padding: 20 },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' },
  recordText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: { backgroundColor: COLORS.header, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});