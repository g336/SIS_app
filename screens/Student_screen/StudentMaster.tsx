import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  TextInput, Switch, SafeAreaView, Dimensions, Modal, Linking, Alert, Image, Platform, StatusBar
} from 'react-native';
import {
  Menu, Home as HomeIcon, User, ClipboardCheck,
  ChevronDown, ChevronUp, CheckCircle,
  UserCog, BookOpen, ChevronLeft, Clock,
  FileText, LogOut
} from 'lucide-react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; 

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
  border: '#EAECEF', 
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
const Accordion = ({ title, theme, children }: { title: string, theme: any, children: React.ReactNode }) => {
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
      {open && <View style={styles.accBody}>{children}</View>}
    </View>
  );
};

export default function StudentMasterClass({ route, navigation }: { route: any, navigation?: any }) {
  const [screen, setScreen] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday'); 
  const [successMsg, setSuccessMsg] = useState('');
  
  const navHook = useNavigation<any>(); 

  // --- FIXED: DYNAMIC STUDENT ID FETCHING ---
  // Safely catches 'enrollment', 'userId', or 'id' depending on how Login screen sends it
  const passedId = route?.params?.enrollment || route?.params?.userId || route?.params?.id;
  const studentId = passedId ? String(passedId).trim() : "STUDENT_001";
  
  const studentName = route?.params?.userName || "Student Profile";

  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  // --- FIREBASE STATES ---
  const [timetables, setTimetables] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ name: studentName, contact: '', address: '', photoUrl: '', enrollment: studentId });
  const [marks, setMarks] = useState<any[]>([]);
  const [selectedMarksSem, setSelectedMarksSem] = useState('Sem 1');
  const [showMarksDrop, setShowMarksDrop] = useState(false);
  
  // --- FORM STATES ---
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', time: '', reason: '' });

  // --- FIREBASE FETCHING (Core Data) ---
  useEffect(() => {
  const unsubTimetables = firestore().collection('lectures').onSnapshot(snap => {
    setTimetables(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []);
  });

    const unsubMaterials = firestore().collection('course_files').onSnapshot(snap => {
      if (snap) setMaterials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    });

    const unsubAttendance = firestore().collection('student_attendance')
      .where('studentId', '==', studentId)
      .onSnapshot(snap => {
        setMyAttendance(snap ? snap.docs.map(doc => doc.data()) : []);
      });

    const unsubLeaves = firestore().collection('student_leaves')
      .where('studentId', '==', studentId)
      .onSnapshot(snap => {
        setMyLeaves(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []);
      });

    const unsubProfile = firestore().collection('students').doc(studentId).onSnapshot(doc => {
      if (doc && doc.data()) {
        setProfile((prev: any) => ({ ...prev, ...doc.data() }));
      }
    });

    return () => {
      unsubTimetables();
      unsubMaterials();
      unsubAttendance();
      unsubLeaves();
      unsubProfile();
    };
  }, [studentId]);

  // --- FIXED: BULLETPROOF MARKS FETCHING ---
  // This will find the marks even if Faculty typed the ID with extra spaces or lowercase letters
  useEffect(() => {
    const unsubMarks = firestore().collection('student_marks').onSnapshot(snap => {
        if (snap) {
            const allData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            
            const myId = String(studentId).trim().toLowerCase();
            const myEnrollment = String(profile?.enrollment || '').trim().toLowerCase();
            
            const filteredMarks = allData.filter((m: any) => {
                const dbId = String(m.studentId || '').trim().toLowerCase();
                return dbId === myId || (myEnrollment !== '' && dbId === myEnrollment);
            });
            
            setMarks(filteredMarks);
        }
    });
    return () => unsubMarks();
  }, [studentId, profile?.enrollment]);

  const nav = (route: string) => {
    setScreen(route);
    setSidebarOpen(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // --- FIXED: URL OPENER (Android 11+ Bypass & Space Stripper) ---
  const openLink = async (url: string) => {
    try {
      if (!url) {
        return Alert.alert("Error", "No link found for this file.");
      }
      const cleanUrl = String(url).replace(/\s+/g, ''); 
      const formattedUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
      await Linking.openURL(formattedUrl);
    } catch (error) {
      Alert.alert("Error", "Could not open link. Ensure you are signed into Google Drive.");
    }
  };

  // --- FIXED: LOGOUT ---
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            try {
              navHook.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e) {
              navHook.navigate('Login');
            }
          } 
        }
      ]
    );
  };

  // --- FIREBASE ACTIONS ---
  // Ye code StudentMasterClass function ke andar hona chahiye
const submitLeaveRequest = async () => {
  if (!leaveForm.reason || !leaveForm.from || !leaveForm.to) {
    return Alert.alert("Error", "Please fill in all required fields.");
  }
  
  try {
    // 1. Leave Request Table mein daalo
    await firestore().collection('student_leaves').add({
      ...leaveForm,
      studentId,
      studentName: profile.name || studentName,
      status: 'Pending',
      createdAt: firestore.FieldValue.serverTimestamp()
    });

    // 2. Attendance table mein "On Leave" status ke saath daalo taaki attendance count ho
    // Assuming today's date for the leave request in attendance
    await firestore().collection('student_attendance').add({
      studentId: studentId,
      name: profile.name || studentName,
      status: 'On Leave',
      date: new Date().toISOString(),
      semester: profile.semester || '',
      department: profile.department || '',
      reason: leaveForm.reason
    });

    showSuccess('Leave Request Sent ✓');
    setLeaveForm({ from: '', to: '', time: '', reason: '' });
  } catch (e: any) {
    Alert.alert("Error", e.message);
  }
};

  const updateProfile = async () => {
    try {
      await firestore().collection('students').doc(studentId).set(profile, { merge: true });
      showSuccess('Profile Updated ✓');
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // --- CALCULATIONS ---
  const totalClasses = myAttendance.length;
  const presentClasses = myAttendance.filter(a => a.status === 'Present').length;
  const attendancePercentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);

  // --- Screens ---
  const renderHome = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setScreen('TimeTable')} style={[styles.dashboardCard, { backgroundColor: theme.lightBlue }]}>
          <Text style={[styles.dashCardTitle, { color: theme.blueText }]}>Time Table</Text>
          <View style={styles.dashCardFooter}><View style={[styles.dashDot, { backgroundColor: theme.blueText }]} /><Text style={styles.dashCardSub}>View Schedule</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen('Attendance')} style={[styles.dashboardCard, { backgroundColor: theme.lightPurple }]}>
          <Text style={[styles.dashCardTitle, { color: theme.purpleText }]}>Attendance</Text>
          <View style={styles.dashCardFooter}><View style={[styles.dashDot, { backgroundColor: theme.purpleText }]} /><Text style={styles.dashCardSub}>{attendancePercentage}% Present</Text></View>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Quick Links</Text>
      
      <Accordion title="My Marks" theme={theme}>
         <View style={{padding: 15}}>
             
             {/* --- PROPER DROPDOWN FOR SEMESTER 1 TO 6 --- */}
             <TouchableOpacity 
               style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}]}
               onPress={() => setShowMarksDrop(!showMarksDrop)}
             >
               <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{selectedMarksSem}</Text>
               {showMarksDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
             </TouchableOpacity>

             {/* Dropdown Options (Sem 1 to Sem 6) */}
             {showMarksDrop && (
               <View style={{backgroundColor: theme.bg, borderRadius: 12, marginBottom: 15, padding: 10, borderWidth: 1, borderColor: theme.border}}>
                 {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
                   <TouchableOpacity 
                     key={sem} 
                     style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}}
                     onPress={() => {
                       setSelectedMarksSem(sem);
                       setShowMarksDrop(false); // Option select karne ke baad dropdown band kar do
                     }}
                   >
                     <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{sem}</Text>
                   </TouchableOpacity>
                 ))}
               </View>
             )}

             {/* --- DISPLAY MARKS ACCORDING TO SELECTED SEMESTER --- */}
             {(() => {
                 // Marks ko filter karna based on dropdown selection
                 const filteredBySem = marks.filter((m: any) => {
                     const dbSem = String(m.semester || m.sem || '').trim();
                     // Handle both '6' and 'Sem 6' formats from database
                     const formattedDbSem = dbSem.toLowerCase().includes('sem') ? dbSem : `Sem ${dbSem}`;
                     return formattedDbSem.toLowerCase() === selectedMarksSem.toLowerCase();
                 });

                 if (filteredBySem.length === 0) {
                     return <Text style={{color: theme.textLight, marginTop: 10}}>No marks uploaded for {selectedMarksSem}.</Text>;
                 }

                 return filteredBySem.map((m: any, i: number) => (
                     <View key={i} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderColor: theme.border, paddingBottom: 5}}>
                         <Text style={{color: theme.textDark, fontWeight: '600'}}>{m.subject}</Text>
                         <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 16}}>{m.marks}</Text>
                     </View>
                 ));
             })()}

         </View>
      </Accordion>
      <TouchableOpacity style={[styles.accContainer, {padding: 20, flexDirection: 'row', alignItems: 'center'}]} onPress={() => setScreen('Leave Request')}>
          <CheckCircle size={20} color={theme.primary} style={{marginRight: 12}} />
          <Text style={styles.accTitle}>Apply for Leave</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch(screen) {
      case 'Home': return renderHome();
      case 'Update Profile': 
        return (
          <View style={styles.content}>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>Name</Text>
              <View style={styles.inputContainer}>
                <TextInput placeholder="Your Name" placeholderTextColor={theme.textLight} style={styles.input} value={profile.name} onChangeText={t => setProfile({...profile, name: t})} />
              </View>
            </View>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>Contact</Text>
              <View style={styles.inputContainer}>
                <TextInput placeholder="Your Contact" placeholderTextColor={theme.textLight} style={styles.input} value={profile.contact} onChangeText={t => setProfile({...profile, contact: t})} />
              </View>
            </View>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>Address</Text>
              <View style={[styles.inputContainer, {height: 120}]}>
                <TextInput placeholder="Your Address" placeholderTextColor={theme.textLight} style={[styles.input, {textAlignVertical: 'top'}]} multiline value={profile.address} onChangeText={t => setProfile({...profile, address: t})} />
              </View>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={updateProfile}><Text style={styles.actionBtnText}>Apply</Text></TouchableOpacity>
          </View>
        );
      case 'Attendance':
        return (
          <View style={styles.content}>
             <View style={{backgroundColor: theme.surface, padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 20, elevation: 2}}>
                 <Text style={{fontSize: 36, fontWeight: 'bold', color: attendancePercentage < 50 ? '#FF6B6B' : theme.primary}}>{attendancePercentage}%</Text>
                 <Text style={{color: theme.textLight, marginTop: 5}}>Overall Attendance</Text>
             </View>
            <Accordion title="Recent Attendance Records" theme={theme}>
                <View style={{padding: 15}}>
                    {myAttendance.length === 0 ? <Text style={{color: theme.textLight}}>No records found.</Text> : null}
                    {myAttendance.map((a, i) => (
                        <View key={i} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                            <Text style={{color: theme.textDark}}>{new Date(a.date).toLocaleDateString()}</Text>
                            <Text style={{color: a.status === 'Absent' ? '#FF6B6B' : '#4CAF50', fontWeight: 'bold'}}>{a.status}</Text>
                        </View>
                    ))}
                </View>
            </Accordion>
          </View>
        );
      case 'Setting': 
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingItem}><Text style={styles.settingText}>Dark Mode</Text><Switch value={isDarkMode} onValueChange={setIsDarkMode} /></View>
            <TouchableOpacity style={[styles.settingItem, { marginTop: 15, backgroundColor: '#FF6B6B' }]} onPress={handleLogout}>
              <Text style={[styles.settingText, { color: '#FFF' }]}>Log Out</Text>
              <LogOut color="#FFF" size={24} />
            </TouchableOpacity>
          </View>
        );
      case "PYQ's": 
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, {marginBottom: 20}]}>Study Materials / PYQs</Text>
            {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => {
              const semMaterials = materials.filter(m => m.semester === sem || m.sem === sem);
              return (
                <Accordion key={sem} title={`${sem} Materials`} theme={theme}>
                    <View style={{padding: 15}}>
                        {semMaterials.length === 0 ? <Text style={{color: theme.textLight}}>No materials available for {sem}.</Text> : null}
                        {semMaterials.map(m => (
                            <TouchableOpacity key={m.id} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}} onPress={() => openLink(m.link)}>
                                <FileText color={theme.primary} size={24} style={{marginRight: 10}}/>
                                <Text style={{color: theme.textDark, flex: 1}}>{m.title || m.fileName || 'Document'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Accordion>
              );
            })}
          </View>
        );
        case 'TimeTable':
          // --- 1. Filter logic based on logged-in student's profile ---
          const dailyLectures = timetables.filter((lec: any) => {
            if (!profile) return false;
  
            // Day match
            if (lec.day !== activeDay) return false;
  
            // Semester match (Handles '6' vs 'Sem 6' mismatches)
            const stdSem = profile.semester?.includes('Sem') ? profile.semester : `Sem ${profile.semester}`;
            if (lec.semester !== stdSem) return false;
  
            // Department match (Handles spelling variations like "IT" vs "Information Technology")
            const stdDept = profile.department?.trim().toLowerCase();
            const lecDept = lec.department?.trim().toLowerCase();
            
            const isExactMatch = stdDept === lecDept;
            const isITMatch = (stdDept === 'information technology' && lecDept === 'it') || 
                              (stdDept === 'it' && lecDept === 'information technology');
  
            return isExactMatch || isITMatch;
          });
  
          return (
            <View style={styles.content}>
              {/* --- Student Info Header --- */}
              {profile && (
                <View style={{backgroundColor: theme.lightBlue, padding: 15, borderRadius: 12, marginBottom: 20}}>
                  <Text style={{color: theme.blueText, fontWeight: 'bold', fontSize: 16}}>
                    {profile.name || 'Student'}
                  </Text>
                  <Text style={{color: theme.textLight, marginTop: 4, fontWeight: '600'}}>
                    {profile.department || 'Dept Not Set'} | {profile.semester?.includes('Sem') ? profile.semester : `Sem ${profile.semester || 'Not Set'}`}
                  </Text>
                </View>
              )}
  
              {/* --- Day Selector --- */}
              <Text style={[styles.sectionTitle, {marginBottom: 10}]}>Select Day</Text>
              <View style={[styles.fullWidthDayContainer, {marginBottom: 20}]}>
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => {
                    const fullDayMapping: Record<string, string> = {
                        'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 
                        'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday'
                    };
                    // We map the short day (activeDay state) to the full day string expected by the DB
                    const fullDay = fullDayMapping[d];
                    return (
                        <TouchableOpacity 
                            key={d} 
                            onPress={() => setActiveDay(fullDay)} 
                            style={[
                                styles.smallDayTab, 
                                activeDay === fullDay ? styles.activeSmallDayTab : {}
                            ]}
                        >
                            <Text style={[styles.smallDayTabText, activeDay === fullDay ? {color: '#FFF'} : {}]}>{d}</Text>
                        </TouchableOpacity>
                    )
                 })}
              </View>
  
              <Text style={styles.sectionTitle}>Schedule</Text>
              
              {/* --- Filtered Lectures List --- */}
              {dailyLectures.length === 0 ? (
                 <View style={{alignItems: 'center', marginTop: 40}}>
                    <Clock color={theme.textLight} size={40} opacity={0.5} />
                    <Text style={{color: theme.textLight, textAlign: 'center', marginTop: 15, fontSize: 16}}>
                        No lectures scheduled for {activeDay}.
                    </Text>
                 </View>
              ) : (
                  dailyLectures.map((lec: any, index: number) => (
                      <View 
                          key={lec.id || index} 
                          style={[styles.accContainer, {padding: 18, borderLeftWidth: 4, borderLeftColor: theme.primary}]}
                      >
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                              <Text style={{color: theme.textDark, fontWeight: 'bold', fontSize: 18}}>
                                  {lec.subject}
                              </Text>
                              {lec.subCode ? (
                                  <View style={{backgroundColor: theme.inputBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8}}>
                                      <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 12}}>
                                          {lec.subCode}
                                      </Text>
                                  </View>
                              ) : null}
                          </View>
                          
                          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                              <Clock color={theme.textLight} size={14} style={{marginRight: 5}} />
                              <Text style={{color: theme.textLight, fontWeight: '500'}}>
                                  {lec.time || `${lec.startTime} - ${lec.endTime}`}
                              </Text>
                          </View>
                          
                          <Text style={{color: theme.textLight, marginTop: 4, fontWeight: '500'}}>
                              Room: {lec.room || 'N/A'}
                          </Text>
                      </View>
                  ))
              )}
            </View>
          );
      case 'Profile': 
        return (
          <View style={styles.content}>
            <View style={styles.profileHeader}>
              {profile.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={styles.avatarLarge} />
              ) : (
                <View style={styles.avatarLarge}>
                  <User color="#FFF" size={50} />
                </View>
              )}
              <Text style={styles.profileName}>{profile.name}</Text>
            </View>
            <View style={styles.tabGrid}>
              <View style={[styles.tabItem, {backgroundColor: theme.lightBlue}]}><Text style={styles.tabLabel}>Department</Text><Text style={[styles.tabValue, {color: theme.blueText}]}>{profile.department || 'N/A'}</Text></View>
              <View style={[styles.tabItem, {backgroundColor: theme.lightPurple}]}><Text style={styles.tabLabel}>Enrollment</Text><Text style={[styles.tabValue, {color: theme.purpleText}]}>{studentId}</Text></View>
            </View>
          </View>
        );
      case 'Leave Request':
        return (
          <View style={styles.content}>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>From (Date)</Text>
              <View style={styles.inputContainer}><TextInput placeholder="Start date..." placeholderTextColor={theme.textLight} style={styles.input} value={leaveForm.from} onChangeText={t => setLeaveForm({...leaveForm, from: t})} /></View>
            </View>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>To (Date)</Text>
              <View style={styles.inputContainer}><TextInput placeholder="End date..." placeholderTextColor={theme.textLight} style={styles.input} value={leaveForm.to} onChangeText={t => setLeaveForm({...leaveForm, to: t})} /></View>
            </View>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>Time/Duration</Text>
              <View style={styles.inputContainer}><TextInput placeholder="e.g. 2 Days" placeholderTextColor={theme.textLight} style={styles.input} value={leaveForm.time} onChangeText={t => setLeaveForm({...leaveForm, time: t})} /></View>
            </View>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textDark, fontWeight: '700', marginBottom: 8 }}>Reason</Text>
              <View style={[styles.inputContainer, {height: 120}]}><TextInput placeholder="Write reason..." placeholderTextColor={theme.textLight} style={[styles.input, {textAlignVertical: 'top'}]} multiline value={leaveForm.reason} onChangeText={t => setLeaveForm({...leaveForm, reason: t})} /></View>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={submitLeaveRequest}><Text style={styles.actionBtnText}>Apply for Leave</Text></TouchableOpacity>

            <Text style={[styles.sectionTitle, {marginTop: 30}]}>My Leave History</Text>
            {myLeaves.map(l => (
                <View key={l.id} style={{backgroundColor: theme.surface, padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: theme.border}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                        <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{l.from} to {l.to}</Text>
                        <Text style={{color: l.status === 'Approved' ? '#4CAF50' : l.status === 'Denied' ? '#FF6B6B' : theme.textLight, fontWeight: 'bold'}}>{l.status}</Text>
                    </View>
                    <Text style={{color: theme.textLight}}>{l.reason}</Text>
                </View>
            ))}
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
            
            <View style={styles.drawerProfile}>
              {profile.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={[styles.avatarMedium, {borderWidth: 2, borderColor: '#FFF'}]} />
              ) : (
                <View style={styles.avatarMedium}>
                  <User color="#FFF" size={40} />
                </View>
              )}
              <Text style={styles.drawerName}>{profile.name}</Text>
            </View>

            <View style={{paddingHorizontal: 20, paddingTop: 10}}>
              {['Home', 'Profile', 'Leave Request', 'Setting'].map((item) => (
                <TouchableOpacity key={item} style={styles.sidebarItem} onPress={() => nav(item)}>
                  <Text style={styles.sidebarText}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
                  <Text style={[styles.sidebarText, {color: '#FF6B6B'}]}>Log out</Text>
              </TouchableOpacity>
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

const getStyles = (C: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 120 },
  topHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    height: 70,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 // <-- YEH LINE ADD KI HAI
  },  
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
  accHeaderOpen: { borderBottomWidth: 1, borderBottomColor: C.border },
  accHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  accTitle: { color: C.textDark, fontSize: 16, fontWeight: '600' },
  accBody: { backgroundColor: C.surface, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  inputContainer: { backgroundColor: C.inputBg, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 15, borderWidth: C.isDark ? 1 : 0, borderColor: C.border },
  input: { color: C.textDark, fontSize: 15, flex: 1 },
  actionBtn: { backgroundColor: C.primary, paddingVertical: 18, borderRadius: 22, alignItems: 'center', marginTop: 15 },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  profileHeader: { alignItems: 'center', marginVertical: 25 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
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
  avatarMedium: { width: 75, height: 75, borderRadius: 38, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  drawerName: { fontSize: 22, fontWeight: '700', color: C.textDark, marginTop: 15 },
  sidebarItem: { paddingVertical: 20, paddingHorizontal: 25 },
  sidebarText: { color: C.textDark, fontSize: 17, fontWeight: '600' },
  modalSuccessOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  successCard: { backgroundColor: C.surface, padding: 45, borderRadius: 35, alignItems: 'center', width: '85%', elevation: 10 },
  successText: { color: C.textDark, fontSize: 19, textAlign: 'center', fontWeight: '700', marginTop: 20 },
  inputField: { padding: 15, borderRadius: 12, fontSize: 15 }
});

function setMarks(filteredMarks: any[]) {
  throw new Error('Function not implemented.');
}
