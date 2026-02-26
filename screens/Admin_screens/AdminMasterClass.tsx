import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Switch, Dimensions, Alert, StatusBar, Image 
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import firestore from '@react-native-firebase/firestore';

// --- THEME & CONTEXT CONFIGURATION ---
type ThemeColors = {
  header: string; background: string; pill: string;
  darkCard: string; text: string; white: string;
};

interface AppContextType {
  theme: ThemeColors; isDark: boolean; toggleTheme: () => void; adminId: string;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const lightTheme: ThemeColors = { 
  header: '#8EBBFF', background: '#D1DCE8', pill: '#8EBBFF', 
  darkCard: '#3E76B1', text: '#5D8AC1', white: '#FFFFFF' 
};
const darkTheme: ThemeColors = { 
  header: '#1E293B', background: '#0F172A', pill: '#334155', 
  darkCard: '#1E293B', text: '#94A3B8', white: '#E2E8F0' 
};

const AppContext = createContext<AppContextType>({ 
  theme: lightTheme, isDark: false, toggleTheme: () => {}, adminId: '' 
});

const SharedHeader = ({ title, navigation, showBack = false }: { title: string, navigation: any, showBack?: boolean }) => {
    const insets = useSafeAreaInsets();
    const { theme, isDark } = useContext(AppContext);
    return (
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.header }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => showBack ? navigation.goBack() : navigation.openDrawer()}>
            <Icon name={showBack ? "arrow-left" : "menu"} color={theme.text} size={30} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{title}</Text>
          <View style={{ width: 30 }} />
        </View>
      </View>
    );
  };
  
  const SharedFooter = ({ navigation, active = 'home' }: { navigation: any, active?: string }) => {
    const { theme } = useContext(AppContext);
    return (
      <View style={styles.footerWrapper}>
        <View style={[styles.footerPill, { backgroundColor: theme.header }]}>
          <TouchableOpacity onPress={() => navigation.navigate('AdminHome')}>
            <Icon name="home-variant" color={active === 'home' ? theme.white : theme.text} size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}>
            <Icon name="account-circle" color={active === 'profile' ? theme.white : theme.text} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const AccordionPill = ({ label, isOpen, onPress, children }: { label: string, isOpen: boolean, onPress: () => void, children: React.ReactNode }) => {
    const { theme } = useContext(AppContext);
    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.pill, { backgroundColor: theme.pill, borderBottomLeftRadius: isOpen ? 0 : 30, borderBottomRightRadius: isOpen ? 0 : 30 }]}>
          <Text style={[styles.pillText, { color: theme.text }]}>{label}</Text>
          <Icon name={isOpen ? "chevron-up" : "chevron-down"} color={theme.text} size={28} />
        </TouchableOpacity>
        {isOpen && <View style={[styles.expandedBox, { backgroundColor: theme.darkCard }]}>{children}</View>}
      </View>
    );
  };

  const AdminDashboardScreen = ({ navigation }: { navigation: any }) => {
    const { theme, adminId } = useContext(AppContext);
    const menus = [
      { t: "Mark Faculty Attendance", r: "MarkFaculty", i: "account-check" },
      { t: "Subject Entry", r: "SubjectEntry", i: "book-plus-multiple" }, 
      { t: "Master Class (Faculty)", r: "MasterClassFlow", i: "account-group" },
      { t: "Course Management", r: "CourseFlow", i: "school-outline" },
      { t: "Subject Allocation", r: "SubjectAllocation", i: "link-variant" },
      { t: "Student Entry", r: "StudentEntry", i: "account-plus" },
      { t: "Timetable Management", r: "TimetableFlow", i: "calendar-clock" }
    ];
  
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title={`Admin: ${adminId}`} navigation={navigation} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.dashboardGrid}>
            {menus.map((item, i) => (
              <TouchableOpacity key={i} style={[styles.pill, { backgroundColor: theme.pill, marginBottom: 12 }]} onPress={() => navigation.navigate(item.r)}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                  <Icon name={item.i} color={theme.text} size={26} />
                  <Text style={[styles.pillText, { color: theme.text }]}>{item.t}</Text>
                </View>
                <Icon name="arrow-right-bold-circle-outline" color={theme.text} size={26} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <SharedFooter navigation={navigation} active="home" />
      </View>
    );
};

const SettingsScreen = ({ navigation }: { navigation: any }) => {
    const { theme, isDark, toggleTheme } = useContext(AppContext);
  
    const handleLogout = () => {
      Alert.alert(
        "Logout",
        "Are you sure you want to sign out of the SIS System?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Logout", 
            style: "destructive", 
            onPress: () => navigation.replace('Login') // Ensure 'Login' matches your root navigator name
          }
        ]
      );
    };
  
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title="App Settings" navigation={navigation} showBack />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Theme Toggle Section */}
          <View style={[styles.settingsCard, { backgroundColor: theme.pill }]}>
            <View>
              <Text style={[styles.settingsTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={{ color: theme.text, fontSize: 12, opacity: 0.7 }}>
                Adjust the visual appearance of the app
              </Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme} 
              thumbColor={theme.white} 
              trackColor={{ false: "#767577", true: theme.darkCard }} 
            />
          </View>
  
          {/* Logout Button Section */}
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FF6B6B', marginTop: 30 }]} 
            onPress={handleLogout}
          >
            <Icon name="logout" color="white" size={24} />
            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 18 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
  
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: theme.text, opacity: 0.5 }}>SIS App Version 1.0.4</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

const AdminProfileScreen = ({ navigation }: { navigation: any }) => {
    const { theme, adminId } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({ name: '', department: '', photoUrl: '' });
  
    useEffect(() => {
      if (!adminId) return;
      const unsub = firestore().collection('admins').doc(adminId).onSnapshot(doc => {
        if (doc?.exists()) {
          const data = doc.data();
          setProfile({
            name: data?.name || '',
            department: data?.department || '',
            photoUrl: data?.photoUrl || ''
          });
        }
      });
      return () => unsub();
    }, [adminId]);
  
    const saveProfile = async () => {
      try {
        await firestore().collection('admins').doc(adminId).set(profile, { merge: true });
        setIsEditing(false);
        Alert.alert("Success", "Profile Updated");
      } catch (e: any) { Alert.alert("Error", e.message); }
    };
  
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title="My Profile" navigation={navigation} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.profileCard, { backgroundColor: theme.darkCard }]}>
            <View style={styles.imageContainer}>
              {profile?.photoUrl ? (
                 <Image source={{ uri: profile.photoUrl }} style={styles.profileImage} />
              ) : (
                <Icon name="account-circle" size={110} color={theme.white} />
              )}
            </View>
            <Text style={styles.profileMainName}>{profile?.name || adminId}</Text>
          </View>
  
          {isEditing ? (
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.inputField} value={profile.name} onChangeText={t => setProfile({...profile, name: t})} />
              <TouchableOpacity style={styles.actionBtn} onPress={saveProfile}>
                <Text style={{color:'white', fontWeight:'bold'}}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.pill}]} onPress={() => setIsEditing(true)}>
              <Text style={{color: theme.text, fontWeight:'bold'}}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <SharedFooter navigation={navigation} active="profile" />
      </View>
    );
};

const SubjectEntryScreen = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(AppContext);
    const [form, setForm] = useState({ subjectName: '', subjectCode: '' });
  
    const saveSubject = async () => {
      if (!form.subjectName || !form.subjectCode) return Alert.alert("Required", "Fill all fields");
      await firestore().collection('subjects').add({ ...form, createdAt: firestore.FieldValue.serverTimestamp() });
      Alert.alert("Success", "Subject Added");
      navigation.goBack();
    };
  
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title="Subject Entry" navigation={navigation} showBack />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.inputLabel}>Enter Subject Title</Text>
          <TextInput style={styles.inputField} placeholder="e.g. Data Structures" onChangeText={t => setForm({...form, subjectName: t})} />
          
          <Text style={styles.inputLabel}>Enter Subject Code</Text>
          <TextInput style={styles.inputField} placeholder="e.g. CS-401" onChangeText={t => setForm({...form, subjectCode: t})} />
          
          <TouchableOpacity style={styles.actionBtn} onPress={saveSubject}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Save to Database</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
};

const SubjectAllocationScreen = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(AppContext);
    const [courses, setCourses] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ dept: '', empId: '', subject: '' });
  
    useEffect(() => {
      firestore().collection('courses').get().then(s => setCourses(s.docs.map(d => d.data().courseName)));
    }, []);
  
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title="Allocation" navigation={navigation} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.inputLabel}>Target Department</Text>
          <AccordionPill label={form.dept || "Select Course"} isOpen={open} onPress={() => setOpen(!open)}>
            {courses.map(c => (<TouchableOpacity key={c} onPress={() => {setForm({...form, dept:c}); setOpen(false);}}><Text style={{color:'white', padding:15}}>{c}</Text></TouchableOpacity>))}
          </AccordionPill>
          <Text style={styles.inputLabel}>Faculty ID</Text>
          <TextInput style={styles.inputField} placeholder="EMP ID" onChangeText={t => setForm({...form, empId: t})} />
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Allocated")}><Text style={{color:'white'}}>Confirm</Text></TouchableOpacity>
        </ScrollView><SharedFooter navigation={navigation} />
      </View>
    );
};

const MarkFacultyAttendanceScreen = ({ navigation }: { navigation: any }) => {
  const { theme } = useContext(AppContext);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State for Leave Requests
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

  useEffect(() => {
    const unsubFaculty = firestore().collection('faculty').onSnapshot(snap => {
      setFaculty(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []);
    });

    // NEW: Fetch Faculty Leaves
    const unsubLeaves = firestore().collection('faculty_leaves').onSnapshot(snap => {
      setLeaveRequests(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []);
    });

    return () => {
      unsubFaculty();
      unsubLeaves();
    };
  }, []);

  const submitAttendance = async () => {
    setIsSubmitting(true);
    try {
      const batch = firestore().batch();
      const today = new Date().toDateString();
      faculty.forEach(f => {
        const ref = firestore().collection('faculty_attendance').doc();
        batch.set(ref, { 
          name: f.name, 
          empId: f.employeeId, 
          status: attendance[f.id] || 'Present', 
          date: today 
        });
      });
      await batch.commit();
      Alert.alert("Success", "Daily attendance records saved.");
      navigation.goBack();
    } catch (e: any) { Alert.alert("Error", e.message); } finally { setIsSubmitting(false); }
  };

  // NEW: Action to process leave requests
  const processLeaveRequest = async (id: string, newStatus: 'Approved' | 'Denied') => {
    try {
      await firestore().collection('faculty_leaves').doc(id).update({
        status: newStatus,
        processedAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", `Leave request has been ${newStatus.toLowerCase()}.`);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const pendingLeaves = leaveRequests.filter(req => req.status === 'Pending');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SharedHeader title="Attendance & Leaves" navigation={navigation} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* NEW: Leave Requests UI */}
        <Text style={styles.inputLabel}>Pending Faculty Leaves</Text>
        {pendingLeaves.length === 0 ? (
          <View style={[styles.pill, { backgroundColor: theme.pill, marginBottom: 20 }]}>
            <Text style={{ color: theme.text, fontWeight: 'bold', textAlign: 'center', width: '100%' }}>No pending requests.</Text>
          </View>
        ) : (
          pendingLeaves.map(req => (
            <View key={req.id} style={{ backgroundColor: theme.darkCard, padding: 15, borderRadius: 20, marginBottom: 15 }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 5}}>
                {req.name || 'Faculty Member'}
              </Text>
              <Text style={{color: 'white', fontSize: 13}}>From: {req.from}   To: {req.to}</Text>
              <Text style={{color: 'white', fontSize: 13, marginBottom: 5}}>Duration: {req.time}</Text>
              <Text style={{color: 'white', fontStyle: 'italic', marginBottom: 15}}>Reason: {req.reason}</Text>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity 
                  style={{backgroundColor: '#4CAF50', padding: 10, borderRadius: 12, flex: 0.48, alignItems: 'center'}} 
                  onPress={() => processLeaveRequest(req.id, 'Approved')}
                >
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{backgroundColor: '#FF6B6B', padding: 10, borderRadius: 12, flex: 0.48, alignItems: 'center'}} 
                  onPress={() => processLeaveRequest(req.id, 'Denied')}
                >
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Deny</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* EXISTING: Attendance UI */}
        <Text style={styles.inputLabel}>Daily Attendance (Tap to toggle)</Text>
        {faculty.map(f => (
          <TouchableOpacity 
            key={f.id} 
            style={[styles.pill, { backgroundColor: theme.pill, marginBottom: 8 }]} 
            onPress={() => setAttendance({...attendance, [f.id]: attendance[f.id] === 'Absent' ? 'Present' : 'Absent'})}
          >
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{f.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: attendance[f.id] === 'Absent' ? '#FF6B6B' : '#4CAF50' }]}>
              <Text style={{ color: 'white', fontSize: 12 }}>{attendance[f.id] || 'Present'}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.actionBtn, {marginTop: 20}]} onPress={submitAttendance}>
          <Icon name="cloud-upload" color="white" size={24} />
          <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 10 }}>{isSubmitting ? "Saving..." : "Submit Records"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const FacultyListScreen = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(AppContext);
    const [list, setList] = useState<any[]>([]);
    useEffect(() => {
      return firestore().collection('faculty').orderBy('name').onSnapshot(snap => {
        setList(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []);
      });
    }, []);
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title="Faculty Directory" navigation={navigation} showBack />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {list.map(f => (
            <View key={f.id} style={[styles.pill, { backgroundColor: theme.pill, marginBottom: 12 }]}>
              <View><Text style={{ color: theme.text, fontWeight: 'bold' }}>{f.name}</Text></View>
              <TouchableOpacity onPress={() => firestore().collection('faculty').doc(f.id).delete()}><Icon name="delete" color="#FF6B6B" size={24} /></TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('FacultyEntry')}><Text style={{color:'white'}}>Add New</Text></TouchableOpacity>
        </ScrollView>
      </View>
    );
};


const StudentEntryScreen = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(AppContext);
    const [courses, setCourses] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', enrollment: '', department: '' });
  
    useEffect(() => {
      firestore().collection('courses').onSnapshot(snap => setCourses(snap ? snap.docs.map(doc => doc.data().courseName) : []));
    }, []);
  
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SharedHeader title="Student Entry" navigation={navigation} showBack />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.inputLabel}>Student Full Name</Text>
          <TextInput style={styles.inputField} placeholder="Full Name" onChangeText={t => setForm({...form, name: t})} />
          <Text style={styles.inputLabel}>Enrollment No.</Text>
          <TextInput style={styles.inputField} placeholder="e.g. 21BCA101" onChangeText={t => setForm({...form, enrollment: t})} />
          <Text style={styles.inputLabel}>Department</Text>
          <AccordionPill label={form.department || "Choose Dept"} isOpen={open} onPress={() => setOpen(!open)}>
            {courses.map(c => (<TouchableOpacity key={c} onPress={() => {setForm({...form, department:c}); setOpen(false);}} style={{padding:15}}><Text style={{color:'white'}}>{c}</Text></TouchableOpacity>))}
          </AccordionPill>
          <TouchableOpacity style={[styles.actionBtn, {marginTop: 20}]} onPress={() => Alert.alert("Success")}><Text style={{color:'white'}}>Enroll Student</Text></TouchableOpacity>
        </ScrollView>
      </View>
    );
};

const CourseManagementScreen = ({ navigation }: { navigation: any }) => {
  const { theme } = useContext(AppContext);
  const [courses, setCourses] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState('');

  useEffect(() => {
      return firestore().collection('courses').onSnapshot(snap => {
          setCourses(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []);
      });
  }, []);

  const addCourse = async () => {
      if (!newCourse) return;
      await firestore().collection('courses').add({ courseName: newCourse });
      setNewCourse('');
  };

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
          <SharedHeader title="Course Manager" navigation={navigation} showBack />
          <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.inputLabel}>Register New Department/Course</Text>
              <TextInput 
                  style={styles.inputField} 
                  placeholder="e.g. B.Tech Computer Science" 
                  value={newCourse}
                  onChangeText={setNewCourse} 
              />
              <TouchableOpacity style={styles.actionBtn} onPress={addCourse}>
                  <Icon name="plus-box" color="white" size={24} />
                  <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 10}}>Add to Catalog</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, {marginTop: 30}]}>Current Catalog</Text>
              {courses.map(c => (
                  <View key={c.id} style={[styles.pill, {backgroundColor: theme.pill, marginBottom: 10}]}>
                      <Text style={{color: theme.text}}>{c.courseName}</Text>
                      <TouchableOpacity onPress={() => firestore().collection('courses').doc(c.id).delete()}>
                          <Icon name="delete" color="#FF6B6B" size={24} />
                      </TouchableOpacity>
                  </View>
              ))}
          </ScrollView>
      </View>
  );
};

const TimetableUploadScreen = ({ navigation }: { navigation: any }) => {
  const { theme } = useContext(AppContext);
  const [form, setForm] = useState({ semester: '', url: '' });

  const saveTT = async () => {
      if (!form.semester || !form.url) return Alert.alert("Error", "Fill all fields");
      await firestore().collection('timetables').add({
          ...form,
          createdAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", "Timetable link added");
      navigation.goBack();
  };

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
          <SharedHeader title="Upload Schedule" navigation={navigation} showBack />
          <View style={{ padding: 20 }}>
              <Text style={styles.inputLabel}>Semester Name</Text>
              <TextInput style={styles.inputField} placeholder="e.g. Semester 4" onChangeText={t => setForm({...form, semester: t})} />
              
              <Text style={styles.inputLabel}>Google Drive URL</Text>
              <TextInput style={styles.inputField} placeholder="Paste Link Here" onChangeText={t => setForm({...form, url: t})} />
              
              <TouchableOpacity style={styles.actionBtn} onPress={saveTT}>
                  <Icon name="content-save" color="white" size={24} />
                  <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 10}}>Save Schedule</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const CustomDrawer = (props: any) => {
    const { theme } = useContext(AppContext);
    return (
      <DrawerContentScrollView {...props} style={{ backgroundColor: theme.header }}>
        <View style={{ padding: 25, backgroundColor: theme.darkCard, marginBottom: 15 }}><Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>SIS SYSTEM</Text></View>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('AdminHome')}><Icon name="view-dashboard" size={24} color={theme.text} /><Text style={[styles.drawerText, { color: theme.text }]}>Dashboard</Text></TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('Settings')}><Icon name="cog" size={24} color={theme.text} /><Text style={[styles.drawerText, { color: theme.text }]}>Settings</Text></TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('AdminProfile')}><Icon name="account" size={24} color={theme.text} /><Text style={[styles.drawerText, { color: theme.text }]}>Profile</Text></TouchableOpacity>
      </DrawerContentScrollView>
    );
};

export default function AdminNavigator({ route }: { route: any }) {
    const [isDark, setIsDark] = useState(false);
    const theme = isDark ? darkTheme : lightTheme;
    const adminId = route?.params?.userId || "Admin";
  
    return (
        <SafeAreaProvider>
        <AppContext.Provider value={{ theme, isDark, toggleTheme: () => setIsDark(!isDark), adminId }}>
          <Drawer.Navigator 
            drawerContent={p => <CustomDrawer {...p} />} 
            screenOptions={{ 
              headerShown: false,
              drawerActiveTintColor: theme.white,
              drawerInactiveTintColor: theme.text,
            }}
          >
            <Drawer.Screen 
              name="AdminHome" 
              component={AdminDashboardScreen} 
              options={{ drawerIcon: ({color}) => <Icon name="view-dashboard" color={color} size={24} /> }}
            />
            <Drawer.Screen 
              name="AdminProfile" 
              component={AdminProfileScreen} 
              options={{ drawerIcon: ({color}) => <Icon name="account-circle" color={color} size={24} /> }}
            />
            <Drawer.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ drawerIcon: ({color}) => <Icon name="cog" color={color} size={24} /> }}
            />
            <Drawer.Screen 
              name="SubjectEntry" 
              component={SubjectEntryScreen} 
              options={{ drawerIcon: ({color}) => <Icon name="book-plus" color={color} size={24} /> }}
            />
            <Drawer.Screen 
              name="SubjectAllocation" 
              component={SubjectAllocationScreen} 
              options={{ drawerIcon: ({color}) => <Icon name="link-variant" color={color} size={24} /> }}
            />
            <Drawer.Screen 
              name="StudentEntry" 
              component={StudentEntryScreen} 
              options={{ drawerIcon: ({color}) => <Icon name="account-plus" color={color} size={24} /> }}
            />
            <Drawer.Screen name="MarkFaculty" component={MarkFacultyAttendanceScreen} options={{ drawerIcon: ({color}) => <Icon name="account-check" color={color} size={24} /> }} />
            <Drawer.Screen 
              name="MasterClassFlow" 
              component={() => (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="L" component={FacultyListScreen} />
                  <Stack.Screen name="FacultyEntry" component={({navigation}:any)=>(<View><SharedHeader title="Entry" navigation={navigation} showBack/><TextInput style={styles.inputField}/><TouchableOpacity onPress={()=>navigation.goBack()}><Text>Save</Text></TouchableOpacity></View>)} />
                </Stack.Navigator>
              )} 
              options={{ drawerIcon: ({color}) => <Icon name="account-group" color={color} size={24} /> }}
            />
           <Drawer.Screen name="CourseFlow" component={CourseManagementScreen} options={{ drawerIcon: ({color}) => <Icon name="school" color={color} size={24} /> }} />
           <Drawer.Screen name="TimetableFlow" component={TimetableUploadScreen} options={{ drawerIcon: ({color}) => <Icon name="calendar-clock" color={color} size={24} /> }} />
          </Drawer.Navigator>
        </AppContext.Provider>
      </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingBottom: 15, paddingHorizontal: 15 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    scrollContent: { padding: 20, gap: 12, paddingBottom: 120 },
    dashboardGrid: { gap: 12 }, 
    pill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 30 },
    pillText: { fontSize: 17, fontWeight: '600' },
    inputLabel: { color: '#5D8AC1', fontSize: 14, fontWeight: 'bold', marginLeft: 10, marginBottom: 5, marginTop: 10 },
    inputField: { padding: 18, borderRadius: 15, fontSize: 16, marginBottom: 15, backgroundColor: '#FFFFFF', elevation: 3, color: '#000', borderWidth: 1, borderColor: '#ccc' },
    actionBtn: { padding: 20, borderRadius: 30, alignItems: 'center', marginTop: 10, backgroundColor: '#3E76B1', elevation: 5, flexDirection: 'row', justifyContent: 'center' },
    profileCard: { borderRadius: 30, padding: 35, alignItems: 'center', marginBottom: 20 },
    imageContainer: { marginBottom: 15 },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF' },
    profileMainName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
    accordionContainer: { marginBottom: 10 },
    expandedBox: { padding: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: -10 },
    formContainer: { gap: 5 },
    settingsCard: { padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingsTitle: { fontSize: 18, fontWeight: 'bold' },
    statusBadge: { 
      paddingHorizontal: 12, 
      paddingVertical: 6, 
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center'
    },
    footerWrapper: { position: 'absolute', bottom: 25, left: 20, right: 20 },
    footerPill: { height: 70, borderRadius: 35, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 10 },
    drawerItem: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 15 },
    drawerText: { fontSize: 18, fontWeight: 'bold' }
    
});