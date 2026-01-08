import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StudentHomeScreen from '../screens/StudentHomeScreen';
import ResultScreen from '../screens/ResultScreen';
import PYQScreen from '../screens/PYQScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { RootStackParamList } from '../App';
import { RouteProp } from '@react-navigation/native';

type StudentTabsRouteProp = RouteProp<
  RootStackParamList,
  'StudentTabs'
>;

type Props = {
  route: StudentTabsRouteProp;
};

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

/* ---------- Floating Tab Bar ---------- */
function FloatingTabBar({ state, navigation }: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => navigation.navigate(route.name)}
            >
              <View style={[styles.icon, focused && styles.iconActive]} />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ---------- Student Tabs ---------- */
const StudentTabs: React.FC<Props> = ({ route }) => {
  const { enrollment } = route.params; // ✅ SAFE

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={StudentHomeScreen}
        initialParams={{ enrollment }}
      />

      <Tab.Screen
        name="Results"
        component={ResultScreen}
        initialParams={{ enrollment }}
      />

      <Tab.Screen
        name="PYQ"
        component={PYQScreen}
        initialParams={{ enrollment }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ enrollment }}
      />
    </Tab.Navigator>
  );
};

export default StudentTabs;

/* ---------- Styles ---------- */
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
  },
  tabItem: {
    alignItems: 'center',
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
