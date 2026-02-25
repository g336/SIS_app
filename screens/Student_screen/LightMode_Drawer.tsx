import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Menu } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function DrawerMenu({ visible, onClose }) {
  const MENU_ITEMS = ['Home', 'Profile', 'Leave Request', 'Setting', 'Log out'];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Left Side: Drawer Content */}
        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Menu color="#E2E8F0" size={35} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContent}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Right Side: Clickable Overlay to Close */}
        <TouchableOpacity style={styles.closeArea} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(203, 213, 225, 0.7)', // Matches the greyed-out right side
  },
  drawerContainer: {
    width: width * 0.65, // Takes up 65% of the screen
    height: height,
    backgroundColor: '#8EBBFF', // Light blue drawer background
  },
  header: {
    height: 60,
    backgroundColor: '#5C93E6', // Darker blue header matching the image
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  menuContent: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  menuItem: {
    marginBottom: 25,
  },
  menuText: {
    color: '#4A6FA5',
    fontSize: 22,
    fontFamily: 'serif',
  },
  closeArea: {
    flex: 1, // Fills the remaining right side
  },
});