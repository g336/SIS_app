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
interface PYQ {
  year: string;
  subject: string;
  link: string; // PDF or URL link
}

interface SemesterPYQ {
  semester: string;
  totalPYQs: number;
  status: string;
  pyqs: PYQ[];
}

/* ---------- Mock Data ---------- */
const semesterPYQs: SemesterPYQ[] = [
  {
    semester: 'Fall 2024 (Sem 3)',
    totalPYQs: 5,
    status: 'Completed',
    pyqs: [
      { year: '2023', subject: 'Analysis of Algorithms', link: 'https://example.com/algorithms.pdf' },
      { year: '2022', subject: 'Database Management Systems', link: 'https://example.com/dbms.pdf' },
    ],
  },
  {
    semester: 'Spring 2024 (Sem 2)',
    totalPYQs: 4,
    status: 'Completed',
    pyqs: [
      { year: '2023', subject: 'Data Structures', link: 'https://example.com/ds.pdf' },
      { year: '2022', subject: 'Linear Algebra', link: 'https://example.com/la.pdf' },
    ],
  },
];

/* ---------- Accordion ---------- */
const PYQAccordion = ({ record }: { record: SemesterPYQ }) => {
  const [open, setOpen] = useState<boolean>(false);

  const openLink = (url: string) => {
    // open the PDF/URL
    // You can replace this with Linking.openURL
    console.log('Opening link:', url);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => setOpen(!open)}>
        <View style={styles.docIcon}>
          <Text style={styles.docText}>PYQ</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.semester}>{record.semester}</Text>
          <View style={styles.row}>
            <Text style={styles.sgpa}>{record.totalPYQs} PYQs</Text>
            <Text style={styles.credits}>{record.status}</Text>
          </View>
        </View>

        <Text style={styles.expand}>{open ? '−' : '+'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.cardBody}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Year</Text>
            <Text style={[styles.th, { flex: 3 }]}>Subject</Text>
            <Text style={[styles.th, { flex: 2 }]}>Action</Text>
          </View>

          {record.pyqs.map((p, i) => (
            <View key={i} style={styles.courseRow}>
              <Text style={[styles.courseCode, { flex: 2 }]}>{p.year}</Text>
              <Text style={[styles.courseName, { flex: 3 }]}>{p.subject}</Text>
              <TouchableOpacity style={{ flex: 2 }} onPress={() => openLink(p.link)}>
                <Text style={styles.downloadText}>View PDF</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

/* ---------- Screen ---------- */
const PYQScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Previous Year Questions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {semesterPYQs.map((item, i) => (
          <PYQAccordion key={i} record={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PYQScreen;

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
    alignItems: 'center',
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
  downloadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#337ac6',
    textDecorationLine: 'underline',
  },
});
