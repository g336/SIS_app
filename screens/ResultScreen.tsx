import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

/* ---------- Types ---------- */
interface Course {
  code: string;
  name: string;
  grade: string;
  points: number;
}

interface SemesterRecord {
  semester: string;
  sgpa: string;
  status: string;
  credits: number;
  courses: Course[];
}

/* ---------- Mock Data ---------- */
const semesterRecords: SemesterRecord[] = [
  {
    semester: 'Fall 2024 (Sem 3)',
    sgpa: '3.75',
    status: 'Completed',
    credits: 16,
    courses: [
      { code: 'CS301', name: 'Analysis of Algorithms', grade: 'A', points: 4.0 },
      { code: 'CS302', name: 'Database Management Systems', grade: 'A-', points: 3.7 },
      { code: 'CS305', name: 'Computer Networks', grade: 'B+', points: 3.3 },
      { code: 'MA301', name: 'Discrete Mathematics', grade: 'A', points: 4.0 },
    ],
  },
  {
    semester: 'Spring 2024 (Sem 2)',
    sgpa: '3.92',
    status: 'Completed',
    credits: 15,
    courses: [
      { code: 'CS201', name: 'Data Structures', grade: 'A', points: 4.0 },
      { code: 'CS204', name: 'Digital Logic Design', grade: 'A', points: 4.0 },
      { code: 'MA201', name: 'Linear Algebra', grade: 'A', points: 4.0 },
      { code: 'HU201', name: 'Technical Communication', grade: 'B', points: 3.0 },
    ],
  },
];

/* ---------- Accordion ---------- */
const ResultAccordion = ({ record }: { record: SemesterRecord }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => setOpen(!open)}>
        <View style={styles.docIcon}>
          <Text style={styles.docText}>DOC</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.semester}>{record.semester}</Text>
          <View style={styles.row}>
            <Text style={styles.sgpa}>SGPA: {record.sgpa}</Text>
            <Text style={styles.credits}>{record.credits} Credits</Text>
          </View>
        </View>

        <Text style={styles.expand}>{open ? '−' : '+'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.cardBody}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 3 }]}>Course</Text>
            <Text style={[styles.th, { flex: 1 }]}>Grade</Text>
            <Text style={[styles.th, { flex: 1 }]}>Pts</Text>
          </View>

          {record.courses.map((c, i) => (
            <View key={i} style={styles.courseRow}>
              <View style={{ flex: 3 }}>
                <Text style={styles.courseCode}>{c.code}</Text>
                <Text style={styles.courseName}>{c.name}</Text>
              </View>
              <Text style={styles.grade}>{c.grade}</Text>
              <Text style={styles.points}>{c.points.toFixed(1)}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.downloadBtn}>
            <Text style={styles.downloadText}>↓ Download PDF Marksheet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/* ---------- Screen ---------- */
const ResultScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Records</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'CGPA', value: '3.82' },
            { label: 'RANK', value: '04/60' },
            { label: 'CREDITS', value: '45' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Semester History</Text>

        {semesterRecords.map((item, i) => (
          <ResultAccordion key={i} record={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfeaf7',
  },
  header: {
    height: 60,
    backgroundColor: '#7fb3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#243B55',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#243B55',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#243B55',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c7e2ff',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  docIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#7fb3ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  semester: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#243B55',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sgpa: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 8,
  },
  credits: {
    fontSize: 10,
    color: '#64748B',
  },
  expand: {
    fontSize: 20,
    color: '#7fb3ff',
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  th: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  courseRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  courseName: {
    fontSize: 10,
    color: '#64748b',
  },
  grade: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#059669',
  },
  points: {
    flex: 1,
    textAlign: 'center',
  },
  downloadBtn: {
    marginTop: 12,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#337ac6',
  },
});
