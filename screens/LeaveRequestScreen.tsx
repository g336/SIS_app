import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { addLeave, getLeaves } from '../data/attendanceStore';

const LeaveRequestScreen: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');
  const [refresh, setRefresh] = useState(false);

  const leaves = getLeaves();

  const submitLeave = () => {
    if (!from || !to || !reason) return;

    addLeave({ from, to, reason });

    setFrom('');
    setTo('');
    setReason('');

    setRefresh(!refresh); // force re-render
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Leave Request</Text>

        {/* Form */}
        <TextInput
          placeholder="From (YYYY-MM-DD)"
          value={from}
          onChangeText={setFrom}
          style={styles.input}
        />

        <TextInput
          placeholder="To (YYYY-MM-DD)"
          value={to}
          onChangeText={setTo}
          style={styles.input}
        />

        <TextInput
          placeholder="Reason"
          value={reason}
          onChangeText={setReason}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={submitLeave}>
          <Text style={styles.buttonText}>Apply Leave</Text>
        </TouchableOpacity>

        {/* Leave History */}
        <Text style={styles.historyTitle}>Leave History</Text>

        {leaves.length === 0 ? (
          <Text style={styles.empty}>No leaves taken yet</Text>
        ) : (
          leaves.map(item => (
            <View key={item.id} style={styles.leaveCard}>
              <Text style={styles.leaveText}>
                📅 {item.from} → {item.to}
              </Text>
              <Text style={styles.reason}>📝 {item.reason}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveRequestScreen;

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfeaf7' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  
  input: {
    backgroundColor: '#337ac6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  
  button: {
    backgroundColor: '#337ac6',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
 
  buttonText: { color: '#fff', fontWeight: '700' },
  historyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  empty: { color: '#64748B' },
 
  leaveCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  leaveText: { fontWeight: '600' },
  reason: { marginTop: 4, color: '#475569' },
});
