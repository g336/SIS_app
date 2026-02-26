import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StudentHomeScreen from '../screens/Student_screen/Light-darkModeHomeScreen'; 
import ResultScreen from '../screens/Student_screen/LightModeResult';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

/* ---------------- Floating Tab Bar ---------------- */

function FloatingTabBar({ state, navigation }: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.icon,
                  isFocused && styles.iconActive,
                ]}
              />
              <Text
                style={[
                  styles.label,
                  isFocused && styles.labelActive,
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------- Tabs ---------------- */

export default function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={StudentHomeScreen}
      />
      <Tab.Screen
        name="Results"
        component={ResultScreen}
      />
    </Tab.Navigator>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 25,
    width,
    alignItems: 'center',
  },
  tabBar: {
    width: width * 0.85,
    height: 65,
    backgroundColor: '#7fb3ff',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#243B55',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#3674B5',
    marginBottom: 4,
  },
  iconActive: {
    backgroundColor: '#e6f0ff',
  },
  label: {
    fontSize: 10,
    color: '#3674B5',
  },
  labelActive: {
    fontWeight: '700',
    color: '#243B55',
  },
});
