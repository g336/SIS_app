import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Sidebar() {
  const menuItems = ["Home", "Semester Wise Pdf", "View Attendance", "Semester Timetable", "Settings", "Log out"];

  return (
    <View style={styles.container}>
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.logoText}>III</Text>
        </View>
        <View style={styles.menuList}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem}>
              <Text style={styles.menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  drawer: { width: width * 0.8, backgroundColor: '#8EBBFF', height: '100%' },
  drawerHeader: { backgroundColor: '#5D8AC1', height: 60, justifyContent: 'center', paddingLeft: 20 },
  logoText: { color: '#D1DCE8', fontSize: 28, fontWeight: 'bold', letterSpacing: -2 },
  menuList: { padding: 30, gap: 15 },
  menuText: { fontSize: 20, color: '#4A76AD', fontWeight: '500' },
  overlay: { flex: 1, backgroundColor: '#D1DCE8' }
});