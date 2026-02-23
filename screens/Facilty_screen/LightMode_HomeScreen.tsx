import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, TextInput } from 'react-native';
import { Menu, Book, Home, User, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  header: '#82B7FF',
  background: '#D1DCE8',
  cardText: '#3B6A9F',
  bottomSection: '#3A6B9D',
  navIcon: '#3A6B9D',
  navIconActive: '#FFFFFF',
};

const MODAL_COLORS = {
  overlay: 'rgba(0, 0, 0, 0.5)',
  outerCard: '#5B8DC6',   
  innerCard: '#75A8F2',   
  button: '#7DB1F7',      
  text: '#FFFFFF',        
  placeholder: '#4A7AB5', 
};

const ActionCard = ({ title, halfWidth = false, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} style={halfWidth ? styles.halfCardContainer : styles.fullCardContainer} onPress={onPress}>
    <LinearGradient
      colors={['#D8E9FF', '#A6C9F2']}
      style={styles.cardGradient}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{title}</Text>
        <View style={styles.underline} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [isLectureModalVisible, setLectureModalVisible] = useState(false);
  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
  const [isStudentReportModalVisible, setStudentReportModalVisible] = useState(false);
  const [isAttendanceReportModalVisible, setAttendanceReportModalVisible] = useState(false); // New state

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color={COLORS.cardText} size={36} strokeWidth={2.5} />
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Full Width Cards */}
        <ActionCard title="Lecture" onPress={() => setLectureModalVisible(true)} />
        <ActionCard title="Leave Request" onPress={() => setLeaveModalVisible(true)} />

        {/* Half Width Cards */}
        <View style={styles.row}>
          <ActionCard title={"Student\nReport"} halfWidth onPress={() => setStudentReportModalVisible(true)} />
          {/* Triggers the Attendance Report Modal */}
          <ActionCard title={"Attendance\nReport"} halfWidth onPress={() => setAttendanceReportModalVisible(true)} />
        </View>

        {/* Bottom College Updates Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomSectionText}>College Updates</Text>
        </View>

      </ScrollView>

      {/* --- 1. LECTURE TIMING MODAL --- */}
      <Modal visible={isLectureModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Today's Lecture Timing</Text>
            <View style={styles.modalInnerBox} />
            <TouchableOpacity style={styles.modalButton} onPress={() => setLectureModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- 2. LEAVE APPROVAL MODAL --- */}
      <Modal visible={isLeaveModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { height: '85%' }]}>
            <Text style={styles.modalTitle}>Leave Approval</Text>
            <View style={styles.leaveDetailsBox}>
              <Text style={styles.detailText}>Name :</Text>
              <Text style={styles.detailText}>From :</Text>
              <Text style={styles.detailText}>Till :</Text>
              <Text style={styles.detailText}>Reason :</Text>
            </View>
            <View style={styles.remarkBox}>
              <TextInput placeholder="Remark :" placeholderTextColor={MODAL_COLORS.placeholder} style={styles.remarkInput} multiline textAlignVertical="top" />
            </View>
            <View style={styles.buttonStack}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setLeaveModalVisible(false)}>
                <Text style={styles.modalButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setLeaveModalVisible(false)}>
                <Text style={styles.modalButtonText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- 3. STUDENT REPORT MODAL --- */}
      <Modal visible={isStudentReportModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Student Report</Text>
            <View style={styles.modalInnerBox} />
            <TouchableOpacity style={styles.modalButton} onPress={() => setStudentReportModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- 4. ATTENDANCE REPORT MODAL --- */}
      <Modal visible={isAttendanceReportModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Attendance Report</Text>
            <View style={styles.modalInnerBox} />
            <TouchableOpacity style={styles.modalButton} onPress={() => setAttendanceReportModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Floating Navigation Bar */}
      <View style={styles.footerWrapper}>
        <View style={styles.footerPill}>
          <Book color={COLORS.navIcon} size={28} />
          <Home color={COLORS.navIconActive} size={32} />
          <User color={COLORS.navIcon} size={28} />
          <FileText color={COLORS.navIcon} size={28} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.header, paddingVertical: 15, paddingHorizontal: 15, gap: 15 },
  headerTitle: { fontSize: 28, color: COLORS.cardText, fontFamily: 'serif' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  fullCardContainer: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  halfCardContainer: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  cardGradient: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  cardContent: { alignItems: 'center' },
  cardText: { fontSize: 32, color: COLORS.cardText, fontFamily: 'serif', textAlign: 'center', marginBottom: 5 },
  underline: { height: 3, backgroundColor: COLORS.cardText, width: '100%', marginTop: 2 },
  bottomSection: { backgroundColor: COLORS.bottomSection, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: 200, marginTop: 10 },
  bottomSectionText: { color: '#FFF', fontSize: 16, fontFamily: 'serif' },
  footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  footerPill: { backgroundColor: COLORS.header, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 5 },

  // Shared Modal Styles
  modalOverlay: { flex: 1, backgroundColor: MODAL_COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', height: '75%', backgroundColor: MODAL_COLORS.outerCard, borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 24, color: MODAL_COLORS.text, fontFamily: 'serif', textAlign: 'center', marginTop: 5, marginBottom: 15 },
  modalButton: { backgroundColor: MODAL_COLORS.button, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  modalButtonText: { fontSize: 22, color: COLORS.cardText, fontFamily: 'serif' },
  
  // Standard Inner Box (Lecture, Student Report, Attendance Report)
  modalInnerBox: { flex: 1, backgroundColor: MODAL_COLORS.innerCard, borderRadius: 15, marginBottom: 20 },
  
  // Leave Modal Specific
  leaveDetailsBox: { flex: 1.5, backgroundColor: MODAL_COLORS.innerCard, borderRadius: 15, padding: 20, marginBottom: 15 },
  detailText: { fontSize: 20, color: COLORS.cardText, fontFamily: 'serif', marginBottom: 10 },
  remarkBox: { flex: 0.8, backgroundColor: MODAL_COLORS.innerCard, borderRadius: 15, padding: 15, marginBottom: 15 },
  remarkInput: { fontSize: 18, color: COLORS.cardText, fontFamily: 'serif', flex: 1 },
  buttonStack: { gap: 10, marginTop: 5 },
});