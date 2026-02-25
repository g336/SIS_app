import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView 
} from 'react-native';
import { Menu } from 'lucide-react-native';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimeTableScreen() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} activeOpacity={0.8}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TimeTable</Text>
      </View>

      <View style={styles.daysWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScrollContent}
        >
          {DAYS.map((day) => (
            <TouchableOpacity 
              key={day}
              style={[
                styles.dayChip,
                selectedDay === day && styles.activeDayChip
              ]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.8}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentArea} />

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
  daysWrapper: { marginTop: 20, height: 55 },
  daysScrollContent: { paddingHorizontal: 15, alignItems: 'center' },
  dayChip: {
    backgroundColor: '#4A81CD', borderRadius: 30, paddingHorizontal: 22,
    paddingVertical: 12, marginRight: 12, justifyContent: 'center',
    alignItems: 'center', elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  activeDayChip: { backgroundColor: '#3B78C2', borderWidth: 2, borderColor: '#8EBBFF' },
  dayText: { color: 'white', fontSize: 18, fontFamily: 'serif' },
  contentArea: { flex: 1, marginTop: 15 }
});