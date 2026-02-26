import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, StatusBar
} from 'react-native';
// CLI projects require react-native-svg to be installed as a peer dependency
import { Menu } from 'lucide-react-native';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimeTableScreen() {
  // 1. Explicitly type the state as a string to match CLI TypeScript requirements
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  return (
    <SafeAreaView style={styles.container}>
      {/* 2. Added StatusBar to match the header color on Android/iOS */}
      <StatusBar backgroundColor="#8EBBFF" barStyle="dark-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} activeOpacity={0.8}>
          <Menu color="#4A6FA5" size={40} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TimeTable</Text>
      </View>

      {/* --- DAY SELECTOR --- */}
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

      {/* --- CONTENT AREA --- */}
      <View style={styles.contentArea}>
        {/* Placeholder for actual timetable entries */}
        <View style={styles.tablePlaceholder}>
          <Text style={styles.placeholderText}>
            Schedule for {selectedDay} will load here.
          </Text>
        </View>
      </View>

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
  daysWrapper: { marginTop: 20, height: 55 },
  daysScrollContent: { paddingHorizontal: 15, alignItems: 'center' },
  dayChip: {
    backgroundColor: '#4A81CD', borderRadius: 30, paddingHorizontal: 22,
    paddingVertical: 12, marginRight: 12, justifyContent: 'center',
    alignItems: 'center', elevation: 3, 
  },
  activeDayChip: { 
    backgroundColor: '#3B78C2', 
    borderWidth: 2, 
    borderColor: '#8EBBFF' 
  },
  dayText: { color: 'white', fontSize: 18 },
  contentArea: { flex: 1, marginTop: 15, paddingHorizontal: 15 },
  tablePlaceholder: { 
    flex: 1, 
    backgroundColor: '#3B78C2', 
    borderRadius: 25, 
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: { color: 'white', fontSize: 18, textAlign: 'center' }
});