import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { students } from '../data/student';

const ProfileScreen = ({ route }: any) => {
  const { enrollment } = route.params;

  const student = students[enrollment]; // ✅ FIXED

  const [webModalVisible, setWebModalVisible] = useState(false);
  const [webLink, setWebLink] = useState('');

  const studentDetails = {
    name: student.name,
    email: student.email,
    rollNo: student.rollNo,
    department: student.department,
    year: student.year,
  };

  const documents = student.documents;

  const openDocument = (link: string) => {
    let finalLink = link;

    if (link.includes('drive.google.com')) {
      const fileIdMatch = link.match(/\/d\/(.+?)\//);
      if (fileIdMatch && fileIdMatch[1]) {
        finalLink = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }

    setWebLink(finalLink);
    setWebModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7fb3ff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Student Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Student Details</Text>

          {Object.entries(studentDetails).map(([key, value]) => (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents</Text>

          {documents.length > 0 ? (
            documents.map((doc: any) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.docItem}
                onPress={() => openDocument(doc.link)}
              >
                <Text style={styles.docText}>📄 {doc.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#64748B' }}>
              No documents available
            </Text>
          )}
        </View>
      </ScrollView>

      {/* WebView Modal */}
      <Modal visible={webModalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.webHeader}>
            <TouchableOpacity
              onPress={() => setWebModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.webTitle}>Document Viewer</Text>
          </View>

          {webLink !== '' && (
            <WebView
              source={{ uri: webLink }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

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

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#243B55',
    marginBottom: 12,
  },

  detailRow: { flexDirection: 'row', marginBottom: 8 },
  label: { flex: 1, fontWeight: '600', color: '#64748B' },
  value: { flex: 2, fontWeight: '700', color: '#243B55' },

  docItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  docText: { fontSize: 14, color: '#2c5f9e', fontWeight: '600' },

  webHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7fb3ff',
    paddingHorizontal: 10,
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#337ac6',
    borderRadius: 10,
  },
  closeText: { color: '#fff', fontWeight: '700' },
  webTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    color: '#243B55',
  },
});
