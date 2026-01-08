import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Linking,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

/* ---------- Navigation Types ---------- */
type RootStackParamList = {
  StudentHome: undefined;
  Attendance: undefined;
  PYQ: undefined;
  Profile: undefined;
  LeaveRequest: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* ---------------- Mock Data ---------------- */

const timeTableData = [
  { time: '09:00', subject: 'CC', room: '106' },
  { time: '09:40', subject: 'ML', room: '203' },
  { time: '10:35', subject: 'Small Break', room: '-' },
  { time: '10:50', subject: '-', room: '-' },
  { time: '11:45', subject: 'FS', room: '106' },
  { time: '12:40', subject: 'Break', room: '-' },
  { time: '01:25', subject: '-', room: '-' },
  { time: '02:20', subject: 'ML', room: '203' },
];

const youtubePlaylists = [
  { id: '1', title: 'Mathematics - Calculus', link: 'https://youtube.com' },
  { id: '2', title: 'Physics - Quantum Mechanics', link: 'https://youtube.com' },
  { id: '3', title: 'Computer Science - React Native', link: 'https://youtube.com' },
  { id: '4', title: 'Chemistry - Organic', link: 'https://youtube.com' },
];

/* ---------------- Screen ---------------- */

const StudentHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [timetableModalVisible, setTimetableModalVisible] = useState(false);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false); // KEEP
  const [youtubeModalVisible, setYoutubeModalVisible] = useState(false);

  /* Drawer */
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width * 0.75)).current;

  const toggleDrawer = (open: boolean) => {
    if (open) {
      setDrawerVisible(true);
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(drawerAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setDrawerVisible(false));
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7fb3ff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => toggleDrawer(true)} style={styles.menuButton}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Dashboard</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, Student!</Text>

        {/* Time Table */}
        <TouchableOpacity style={styles.mainCard} onPress={() => setTimetableModalVisible(true)}>
          <Text style={styles.mainCardText}>Time Table</Text>
        </TouchableOpacity>

        {/* Attendance Modal Card */}
        <TouchableOpacity style={styles.mainCard} onPress={() => setAttendanceModalVisible(true)}>
          <Text style={styles.mainCardText}>Attendance</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => navigation.navigate('PYQ')}
          >
            <Text style={styles.smallText}>PYQ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => setYoutubeModalVisible(true)}
          >
            <Text style={styles.smallText}>YouTube{'\n'}Playlist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Drawer */}
      {drawerVisible && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => toggleDrawer(false)}
          />

          <Animated.View style={[styles.drawerContainer, { left: drawerAnim }]}>

            <View style={{ marginTop: 30 }}>
              <TouchableOpacity style={styles.drawerItem} onPress={() => toggleDrawer(false)}>
                <Text style={styles.drawerText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  navigation.navigate('Profile');
                  toggleDrawer(false);
                }}
              >
                <Text style={styles.drawerText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  navigation.navigate('Attendance');
                  toggleDrawer(false);
                }}
              >
                <Text style={styles.drawerText}>Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  navigation.navigate('PYQ');
                  toggleDrawer(false);
                }}
              >
                <Text style={styles.drawerText}>PYQ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  navigation.navigate('LeaveRequest');
                  toggleDrawer(false);
                }}
              >
                <Text style={styles.drawerText}>Leave Request</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={() => toggleDrawer(false)}>
                <Text style={styles.drawerText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={() => toggleDrawer(false)}>
                <Text style={styles.drawerText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* ---------------- MODALS ---------------- */}

      {/* Timetable Modal */}
      <Modal transparent visible={timetableModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Daily Timetable</Text>
            <ScrollView>
              {timeTableData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableTime}>{item.time}</Text>
                  <Text style={styles.tableSubject}>{item.subject}</Text>
                  <Text style={styles.tableRoom}>{item.room}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTimetableModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Attendance Modal */}
      <Modal transparent visible={attendanceModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Attendance</Text>
            <View style={styles.centerContent}>
              <Text style={styles.percentageBig}>85%</Text>
              <Text style={styles.percentageSub}>Overall Attendance</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAttendanceModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* YouTube Modal */}
      <Modal transparent visible={youtubeModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>YouTube Playlists</Text>
            <ScrollView>
              {youtubePlaylists.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.playlistItem}
                  onPress={() => openLink(item.link)}
                >
                  <Text style={styles.playlistText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setYoutubeModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfeaf7' },
  header: {
    backgroundColor: '#7fb3ff',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: { marginRight: 15 },
  menuLine: { width: 22, height: 3, backgroundColor: '#243B55', marginVertical: 2 },
  headerText: { fontSize: 20, fontWeight: '700', color: '#243B55' },
  content: { padding: 20, paddingBottom: 120 },
  welcomeText: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  mainCard: {
    backgroundColor: '#c7e2ff',
    borderRadius: 22,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  mainCardText: { fontSize: 22, fontWeight: '600', color: '#2c5f9e' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  smallCard: {
    width: '47%',
    backgroundColor: '#c7e2ff',
    borderRadius: 18,
    paddingVertical: 25,
    alignItems: 'center',
  },
  smallText: { textAlign: 'center', fontSize: 14 },
  drawerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileName: { fontSize: 18, fontWeight: '700' },
  profileEmail: { fontSize: 12 },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerText: { fontSize: 16, fontWeight: '600', color: '#243B55' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  tableTime: { width: 60, fontWeight: '700' },
  tableSubject: { flex: 1, textAlign: 'center' },
  tableRoom: { width: 60, textAlign: 'right' },
  closeButton: {
    backgroundColor: '#337ac6',
    padding: 14,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: '700' },
  centerContent: { alignItems: 'center', marginVertical: 20 },
  percentageBig: { fontSize: 48, fontWeight: '900' },
  percentageSub: { fontSize: 14 },
  playlistItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playlistText: { fontSize: 14 },
});

export default StudentHomeScreen;
