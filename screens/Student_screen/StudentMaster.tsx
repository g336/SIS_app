import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  TextInput, Switch, SafeAreaView, Dimensions, Modal
} from 'react-native';
import {
  Menu, Home as HomeIcon, User, ClipboardCheck,
  ChevronDown, ChevronUp, CheckCircle,
  UserCog, BookOpen, ChevronLeft, Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- Themes ---
const lightTheme = {
  isDark: false,
  bg: '#F8F9FE',
  primary: '#6772E5',
  textDark: '#1A1D28',
  textLight: '#8A8D9F',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  lightBlue: '#EAF0FF',
  lightPurple: '#F2EAFB',
  blueText: '#5969E6',
  purpleText: '#8E73D4',
  inputBg: '#F3F4F8',
  overlay: 'rgba(0,0,0,0.3)',
};

const darkTheme = {
  isDark: true,
  bg: '#13151F',
  primary: '#6772E5',
  textDark: '#F4F5F9',
  textLight: '#8A8D9F',
  white: '#FFFFFF',
  surface: '#1E212E',
  lightBlue: '#1F2740',
  lightPurple: '#2A1F3D',
  blueText: '#8E9CF2',
  purpleText: '#B194E8',
  inputBg: '#0C0E15',
  overlay: 'rgba(0,0,0,0.7)',
  border: '#2D3F5E',
};

// --- Reusable Components ---
const Accordion = ({ title, theme }) => {
  const [open, setOpen] = useState(false);
  const styles = getStyles(theme);
  return (
    <View style={styles.accContainer}>
      <TouchableOpacity style={[styles.accHeader, open && styles.accHeaderOpen]} onPress={() => setOpen(!open)}>
        <View style={styles.accHeaderLeft}>
          <CheckCircle size={20} color={theme.primary} style={{marginRight: 12}} />
          <Text style={styles.accTitle}>{title}</Text>
        </View>
        {open ? <ChevronUp size={20} color={theme.textLight} /> : <ChevronDown size={20} color={theme.textLight} />}
      </TouchableOpacity>
      {open && <View style={styles.accBody}><Text style={{color: theme.textLight, padding: 15}}>Details for {title}...</Text></View>}
    </View>
  );
};

const LabeledInput = ({ label, placeholder, theme, multiline, height }) => {
  const styles = getStyles(theme);
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>{label}</Text>
      <View style={[styles.inputContainer, multiline && { height: height || 120 }]}>
        <TextInput 
          placeholder={placeholder} 
          placeholderTextColor={theme.textLight} 
          style={[styles.input, multiline && { textAlignVertical: 'top' }]} 
          multiline={multiline}
        />
      </View>
    </View>
  );
};

export default function App() {
  const [screen, setScreen] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDay, setActiveDay] = useState('Mon');
  const [successMsg, setSuccessMsg] = useState('');

  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  const nav = (route) => {
    setScreen(route);
    setSidebarOpen(false);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // --- Screens ---
  const renderHome = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setScreen('TimeTable')} style={[styles.dashboardCard, { backgroundColor: theme.lightBlue }]}>
          <Text style={[styles.dashCardTitle, { color: theme.blueText }]}>Time Table</Text>
          <View style={styles.dashCardFooter}><View style={[styles.dashDot, { backgroundColor: theme.blueText }]} /><Text style={styles.dashCardSub}>Today's Schedule</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen('Attendance')} style={[styles.dashboardCard, { backgroundColor: theme.lightPurple }]}>
          <Text style={[styles.dashCardTitle, { color: theme.purpleText }]}>Attendance</Text>
          <View style={styles.dashCardFooter}><View style={[styles.dashDot, { backgroundColor: theme.purpleText }]} /><Text style={styles.dashCardSub}>Check Records</Text></View>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Quick Links</Text>
      <Accordion title="YouTube Playlist" theme={theme} />
      <Accordion title="Study Materials" theme={theme} />
    </View>
  );

  const renderContent = () => {
    switch(screen) {
      case 'Home': return renderHome();
      case 'Update Profile': 
        return (
          <View style={styles.content}>
            <LabeledInput label="Name" placeholder="Jay" theme={theme} />
            <LabeledInput label="Contact" placeholder="Write contact..." theme={theme} />
            <LabeledInput label="Address" placeholder="Write address..." theme={theme} multiline />
            <TouchableOpacity style={styles.actionBtn} onPress={() => showSuccess('Profile Updated ✓')}><Text style={styles.actionBtnText}>Apply</Text></TouchableOpacity>
          </View>
        );
      case 'Attendance':
        return (
          <View style={styles.content}>
            <Accordion title="Sem 1 Attendance" theme={theme} />
            <Accordion title="Sem 2 Attendance" theme={theme} />
          </View>
        );
      case 'Setting': 
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingItem}><Text style={styles.settingText}>Dark Mode</Text><Switch value={isDarkMode} onValueChange={setIsDarkMode} /></View>
          </View>
        );
      case "PYQ's": 
        return (
          <View style={styles.content}>
            <Accordion title="Semester 1" theme={theme} /><Accordion title="Semester 2" theme={theme} />
          </View>
        );
      case 'TimeTable': 
        return (
          <View style={styles.content}>
            <View style={styles.fullWidthDayContainer}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <TouchableOpacity key={day} onPress={() => setActiveDay(day)} style={[styles.smallDayTab, activeDay === day && styles.activeSmallDayTab]}>
                  <Text style={[styles.smallDayTabText, activeDay === day && { color: theme.white }]}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.sectionTitle, {marginTop: 25}]}>{activeDay} Schedule</Text>
            <View style={styles.scheduleItem}>
              <View style={styles.timeColumn}><Text style={styles.timeText}>08:00 AM</Text></View>
              <View style={[styles.subjectCard, { backgroundColor: theme.lightBlue }]}><Text style={[styles.subjectTitle, { color: theme.blueText }]}>Algorithm</Text></View>
            </View>
          </View>
        );
      case 'Profile': 
        return (
          <View style={styles.content}>
            <View style={styles.profileHeader}><View style={styles.avatarLarge} /><Text style={styles.profileName}>Jay</Text></View>
            <View style={styles.tabGrid}>
              <View style={[styles.tabItem, {backgroundColor: theme.lightBlue}]}><Text style={styles.tabLabel}>Discipline</Text><Text style={[styles.tabValue, {color: theme.blueText}]}>Economics</Text></View>
              <View style={[styles.tabItem, {backgroundColor: theme.lightPurple}]}><Text style={styles.tabLabel}>Semester</Text><Text style={[styles.tabValue, {color: theme.purpleText}]}>6th</Text></View>
            </View>
          </View>
        );
      case 'Leave Request':
        return (
          <View style={styles.content}>
            <LabeledInput label="From" placeholder="Start date..." theme={theme} />
            <LabeledInput label="To" placeholder="End date..." theme={theme} />
            <LabeledInput label="Reason" placeholder="Write reason..." theme={theme} multiline />
            <TouchableOpacity style={styles.actionBtn} onPress={() => showSuccess('Request Sent ✓')}><Text style={styles.actionBtnText}>Apply</Text></TouchableOpacity>
          </View>
        );
      default: return renderHome();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => screen === 'Home' ? setSidebarOpen(true) : setScreen('Home')} style={styles.iconBtn}>
           {screen === 'Home' ? <Menu color={theme.textDark} size={24} /> : <ChevronLeft color={theme.textDark} size={28} />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{screen}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>{renderContent()}</ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => setScreen('Update Profile')}><UserCog color={theme.white} size={24} opacity={screen === 'Update Profile' ? 1 : 0.6} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen("PYQ's")}><BookOpen color={theme.white} size={24} opacity={screen === "PYQ's" ? 1 : 0.6} /></TouchableOpacity>
          <View style={styles.fabOuter}><TouchableOpacity onPress={() => setScreen('Home')} style={styles.fabInner}><HomeIcon color={theme.white} size={26} opacity={screen === 'Home' ? 1 : 0.6} /></TouchableOpacity></View>
          <TouchableOpacity onPress={() => setScreen('TimeTable')}><ClipboardCheck color={theme.white} size={24} opacity={screen === 'TimeTable' ? 1 : 0.6} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('Profile')}><User color={theme.white} size={24} opacity={screen === 'Profile' ? 1 : 0.6} /></TouchableOpacity>
        </View>
      </View>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={() => setSidebarOpen(false)}>
          <View style={styles.sidebar}>
            <View style={styles.drawerProfile}><View style={styles.avatarMedium} /><Text style={styles.drawerName}>Jay</Text></View>
            <View style={{paddingHorizontal: 20, paddingTop: 10}}>
              {['Home', 'Profile', 'Leave Request', 'Setting', 'Log out'].map((item) => (
                <TouchableOpacity key={item} style={styles.sidebarItem} onPress={() => nav(item)}>
                  <Text style={styles.sidebarText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      )}

      <Modal transparent visible={!!successMsg} animationType="fade">
        <View style={styles.modalSuccessOverlay}><View style={styles.successCard}><CheckCircle color={theme.primary} size={40} /><Text style={styles.successText}>{successMsg}</Text></View></View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (C) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 120 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 70, backgroundColor: C.bg },
  headerTitle: { fontSize: 18, color: C.textDark, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingTop: 10 },
  sectionTitle: { fontSize: 18, color: C.textDark, fontWeight: '700', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dashboardCard: { flex: 1, padding: 20, borderRadius: 24, marginHorizontal: 6, height: 140, justifyContent: 'space-between' },
  dashCardTitle: { fontSize: 19, fontWeight: '700' },
  dashCardFooter: { flexDirection: 'row', alignItems: 'center' },
  dashDot: { width: 7, height: 7, borderRadius: 4, marginRight: 8 },
  dashCardSub: { fontSize: 12, color: C.textLight, fontWeight: '500' },
  fullWidthDayContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  smallDayTab: { flex: 1, backgroundColor: C.inputBg, paddingVertical: 12, borderRadius: 14, marginHorizontal: 4, alignItems: 'center' },
  activeSmallDayTab: { backgroundColor: C.primary },
  smallDayTabText: { color: C.textLight, fontSize: 13, fontWeight: '700' },
  scheduleItem: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  timeColumn: { width: 70 },
  timeText: { color: C.textLight, fontSize: 11, fontWeight: '600' },
  subjectCard: { flex: 1, padding: 16, borderRadius: 20 },
  subjectTitle: { fontSize: 16, fontWeight: '700' },
  accContainer: { backgroundColor: C.surface, borderRadius: 18, marginBottom: 15, elevation: 3, borderWidth: C.isDark ? 1 : 0, borderColor: C.border },
  accHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  accTitle: { color: C.textDark, fontSize: 16, fontWeight: '600' },
  accBody: { backgroundColor: C.surface, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  inputContainer: { backgroundColor: C.inputBg, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 15, borderWidth: C.isDark ? 1 : 0, borderColor: C.border },
  input: { color: C.textDark, fontSize: 15, flex: 1 },
  actionBtn: { backgroundColor: C.primary, paddingVertical: 18, borderRadius: 22, alignItems: 'center', marginTop: 15 },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  profileHeader: { alignItems: 'center', marginVertical: 25 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: C.primary },
  profileName: { fontSize: 24, color: C.textDark, fontWeight: '700', marginTop: 12 },
  tabGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tabItem: { width: '48%', padding: 20, borderRadius: 22, marginBottom: 15 },
  tabLabel: { fontSize: 11, color: C.textLight, fontWeight: '600' },
  tabValue: { fontSize: 15, fontWeight: '700', marginTop: 5 },
  settingItem: { backgroundColor: C.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 18, marginBottom: 12 },
  settingText: { color: C.textDark, fontSize: 16, fontWeight: '600' },
  bottomNavWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: C.primary, height: 80, borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  fabOuter: { backgroundColor: C.bg, width: 80, height: 80, borderRadius: 40, marginTop: -40, justifyContent: 'center', alignItems: 'center' },
  fabInner: { backgroundColor: C.primary, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  overlayBg: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: C.overlay, zIndex: 20, justifyContent: 'center', alignItems: 'center' },
  sidebar: { position: 'absolute', top: 0, bottom: 0, left: 0, width: width * 0.75, backgroundColor: C.surface, borderTopRightRadius: 40, borderBottomRightRadius: 40, elevation: 15, zIndex: 30 },
  drawerProfile: { padding: 30, paddingTop: 60, backgroundColor: C.lightBlue, borderTopRightRadius: 40 },
  avatarMedium: { width: 75, height: 75, borderRadius: 38, backgroundColor: C.primary },
  drawerName: { fontSize: 22, fontWeight: '700', color: C.textDark, marginTop: 15 },
  sidebarItem: { paddingVertical: 20, paddingHorizontal: 25 },
  sidebarText: { color: C.textDark, fontSize: 17, fontWeight: '600' },
  modalSuccessOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  successCard: { backgroundColor: C.surface, padding: 45, borderRadius: 35, alignItems: 'center', width: '85%', elevation: 10 },
  successText: { color: C.textDark, fontSize: 19, textAlign: 'center', fontWeight: '700', marginTop: 20 },
});