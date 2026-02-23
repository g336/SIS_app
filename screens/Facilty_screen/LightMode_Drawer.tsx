import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from 'react-native';
import { Menu } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  header: '#5B8DC6',       // Darker blue header
  drawerBody: '#75A8F2',   // Lighter blue drawer background
  overlay: '#D1DCE8',      // Right side dimmed background
  text: '#3B6A9F',         // Dark blue text for items
  icon: '#FFFFFF',         // White menu icon
};

export default function StaticDrawer() {
  const menuItems = [
    "Home",
    "Counsellor",
    "Student Counsellor",
    "Question Pool",
    "Assessment",
    "Feedback",
    "Setting",
    "Log out"
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Static Drawer Container */}
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHeader}>
          <Menu color={COLORS.icon} size={40} strokeWidth={2} />
        </View>

        <View style={styles.drawerBody}>
          {menuItems.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Static Right Side Overlay */}
      <View style={styles.overlayArea} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: 'row' 
  },
  drawerContainer: { 
    width: width * 0.75, // Takes up 75% of the screen
    height: '100%',
    backgroundColor: COLORS.drawerBody,
  },
  drawerHeader: { 
    backgroundColor: COLORS.header, 
    paddingVertical: 15, 
    paddingHorizontal: 15,
    height: 70, // Matches standard header height
    justifyContent: 'center'
  },
  drawerBody: { 
    paddingTop: 20,
    paddingHorizontal: 25,
    gap: 20 // Spacing between menu items
  },
  menuItem: { 
    paddingVertical: 5 
  },
  menuItemText: { 
    fontSize: 26, 
    color: COLORS.text, 
    fontFamily: 'serif' 
  },
  overlayArea: {
    flex: 1,
    backgroundColor: COLORS.overlay, // Fills the remaining right side
  }
});