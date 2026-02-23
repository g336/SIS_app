import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Menu, ChevronRight, Home, UserCircle } from 'lucide-react-native';

// Define the Menu Item type
interface MenuItemProps {
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{label}</Text>
    <ChevronRight color="#FFFFFF" size={24} />
  </TouchableOpacity>
);

const App = () => {
  const menuItems = [
    'Master Class',
    'Course',
    'Subject Entry',
    'Subject Allocation',
    'Student Entry',
    'Academic Details',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Menu color="#FFFFFF" size={28} />
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index} 
              label={item} 
              onPress={() => console.log(`${item} pressed`)} 
            />
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity>
              <Home color="#4DA8FF" size={32} />
            </TouchableOpacity>
            <TouchableOpacity>
              <UserCircle color="#888888" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2139', // Dark theme background
  },
  container: {
    flex: 1,
    backgroundColor: '#11121E', // Darker background for the body
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3F4E81', // Blueish header
    gap: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  menuItem: {
    backgroundColor: '#4E6299', // Item background
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 30, // Highly rounded corners
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
  },
  bottomNavContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2139',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
});

export default App;