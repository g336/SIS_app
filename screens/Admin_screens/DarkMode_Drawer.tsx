import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Menu } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const DrawerScreen = () => {
  const menuOptions = [
    'Home',
    'Semester Wise Pdf',
    'View Attendance',
    'Semester Timetable',
    'Setting',
    'Log out',
  ];

  return (
    <View style={styles.mainOverlay}>
      {/* The Sidebar */}
      <SafeAreaView style={styles.drawerContainer}>
        {/* Header Bar */}
        <View style={styles.drawerHeader}>
          <TouchableOpacity>
            <Menu color="#FFFFFF" size={32} />
          </TouchableOpacity>
        </View>

        {/* Menu Links */}
        <View style={styles.menuList}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* The "Dimmed" right side of the screen */}
      <TouchableOpacity 
        style={styles.dimmedArea} 
        activeOpacity={1} 
        onPress={() => console.log('Close Drawer')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000000', // True black background for the dimming effect
  },
  drawerContainer: {
    width: width * 0.75, // Sidebar takes up 75% of screen width
    height: '100%',
    backgroundColor: '#3F4E81', // Blueish shade from your image
  },
  dimmedArea: {
    width: width * 0.25,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly transparent black
  },
  drawerHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuList: {
    paddingTop: 30,
    paddingHorizontal: 25,
    gap: 22, // Space between menu items
  },
  menuItem: {
    paddingVertical: 4,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

export default DrawerScreen;