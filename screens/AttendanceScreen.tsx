import React, { useState } from 'react';
import { getLeaveDaysCount } from '../data/attendanceStore';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/* ---------- Mock Data ---------- */
interface AttendanceRecord {
  subject: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

const attendanceRecords: AttendanceRecord[] = [
  { subject: 'CC', totalClasses: 40, attended: 36, percentage: 90 },
  { subject: 'ML', totalClasses: 38, attended: 30, percentage: 79 },
  { subject: 'FS', totalClasses: 35, attended: 32, percentage: 91 },
  { subject: 'AI', totalClasses: 30, attended: 28, percentage: 93 },
];

/* ---------- Accordion Component ---------- */
const AttendanceAccordion = ({ record }: { record: AttendanceRecord }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => setOpen(!open)}>
        <Text style={styles.subject}>{record.subject}</Text>
        <Text style={styles.expand}>{open ? '−' : '+'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Classes:</Text>
            <Text style={styles.value}>{record.totalClasses}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Attended:</Text>
            <Text style={styles.value}>{record.attended}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Attendance %:</Text>
            <Text style={styles.value}>{record.percentage}%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

/* ---------- Attendance Screen ---------- */
const AttendanceScreen: React.FC = () => {
  const leaveDays = getLeaveDaysCount();

  /* Apply leave impact */
  const adjustedRecords: AttendanceRecord[] = attendanceRecords.map(record => {
    const adjustedAttended = Math.max(record.attended - leaveDays, 0);

    const percentage =
      record.totalClasses > 0
        ? Math.round((adjustedAttended / record.totalClasses) * 100)
        : 0;

    return {
      ...record,
      attended: adjustedAttended,
      percentage,
    };
  });

  const totalClasses = adjustedRecords.reduce(
    (sum, r) => sum + r.totalClasses,
    0
  );

  const totalAttended = adjustedRecords.reduce(
    (sum, r) => sum + r.attended,
    0
  );

  const overallPercentage =
    totalClasses > 0
      ? Math.round((totalAttended / totalClasses) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Records</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Overall Attendance</Text>
            <Text style={styles.statValue}>{overallPercentage}%</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Leaves Taken</Text>
            <Text style={styles.statValue}>{leaveDays} days</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Subjects</Text>

        {/* IMPORTANT: use adjustedRecords */}
        {adjustedRecords.map((record, index) => (
          <AttendanceAccordion key={index} record={record} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfeaf7' },
  header: {
    height: 60,
    backgroundColor: '#7fb3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#243B55' },
  content: { padding: 16, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#243B55' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#243B55', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: '#c7e2ff' },
  cardHeader: { flexDirection: 'row', padding: 16, justifyContent: 'space-between', alignItems: 'center' },
  subject: { fontSize: 16, fontWeight: 'bold', color: '#243B55' },
  expand: { fontSize: 20, fontWeight: 'bold', color: '#7fb3ff' },
  cardBody: { padding: 16, borderTopWidth: 1, borderColor: '#f1f5f9' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  value: { fontSize: 14, fontWeight: 'bold', color: '#243B55' },
});

export default AttendanceScreen;
