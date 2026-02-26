import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, StatusBar } from 'react-native';
// Lucide icons require react-native-svg to be installed in CLI projects
import { Menu } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// 1. Define types for the props to fix "implicit any" errors in CLI
interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const MENU_ITEMS = ['Home', 'Profile', 'Leave Request', 'Setting', 'Log out'];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* 2. Added StatusBar management for the modal view */}
      <StatusBar backgroundColor={visible ? "#5C93E6" : "#8EBBFF"} barStyle="light-content" />

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
              <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Right Side: Clickable Overlay to Close */}
        <TouchableOpacity 
          style={styles.closeArea} 
          onPress={onClose} 
          activeOpacity={1} 
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(203, 213, 225, 0.7)', 
  },
  drawerContainer: {
    width: width * 0.65, 
    height: height,
    backgroundColor: '#8EBBFF', 
  },
  header: {
    height: 60,
    backgroundColor: '#5C93E6', 
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
    // Removed fontFamily: 'serif' as custom fonts require manual linking in CLI
    fontWeight: '600',
  },
  closeArea: {
    flex: 1, 
  },
});