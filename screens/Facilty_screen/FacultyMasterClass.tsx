import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, 
  ScrollView, Dimensions, Modal, StatusBar, Switch, TextInput, Alert, Image, ActivityIndicator, 
  Platform
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Camera, Mail, Briefcase, Building2 } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';

// --- ICONS ---
import {
  Home as HomeIcon, User, ClipboardCheck, BookOpen, Calendar, 
  ChevronLeft, Settings, BookPlus, Link, UserPlus, LogOut,
  Clock, Users, BookOpenCheck, FileText, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const AppContext = createContext<any>(null);

// --- THEMES ---
const lightTheme = {
  isDark: false, background: '#F8F9FE', primary: '#6772E5', textDark: '#1A1D28', textLight: '#8A8D9F',
  white: '#FFFFFF', surface: '#FFFFFF', inputBg: '#F3F4F8', cardBg1: '#EAF0FF', cardBg2: '#F2EAFB'
};

const darkTheme = {
  isDark: true, background: '#13151F', primary: '#6772E5', textDark: '#F4F5F9', textLight: '#94A3B8',
  white: '#FFFFFF', surface: '#1E212E', inputBg: '#0C0E15', cardBg1: '#1F2740', cardBg2: '#2A1F3D'
};

// --- SHARED HEADER ---
const SharedHeader = ({ title, navigation, showBack = false, theme }: any) => (
  <View style={[styles.topHeader, { backgroundColor: theme.background }]}>
    {showBack ? (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
        <ChevronLeft color={theme.textDark} size={28} />
      </TouchableOpacity>
    ) : <View style={styles.iconBtn} />}
    <Text style={[styles.headerTitle, { color: theme.textDark }]}>{title}</Text>
    <View style={styles.iconBtn} />
  </View>
);

// --- 1. FACULTY DASHBOARD ---
const FacultyHomeScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const menus = [
    { t: "Student Attendance", r: "MarkAttendance", i: <ClipboardCheck color="#5969E6" size={24}/>, bg: theme.cardBg1 },
    { t: "Upload Marks", r: "MarksEntry", i: <BookPlus color="#8E73D4" size={24}/>, bg: theme.cardBg2 }, 
    { t: "Student Leaves", r: "StudentLeaves", i: <User color="#5969E6" size={24}/>, bg: theme.cardBg1 },
    { t: "Apply Leave", r: "ApplyLeave", i: <Link color="#8E73D4" size={24}/>, bg: theme.cardBg2 },
  ];
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="Faculty Dashboard" navigation={navigation} theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Academic Controls</Text>
        <View style={styles.row}>
          {menus.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.dashCard, { backgroundColor: item.bg }]} onPress={() => navigation.navigate(item.r)}>
              {item.i}
              <Text style={[styles.dashCardTitle, { color: theme.primary }]}>{item.t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- 2. FACULTY PROFILE ---
const FacultyProfileScreen = ({ navigation }: any) => {
  const { theme, facultyId, profile, setProfile } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  // --- NAYA: IMAGE PICKER LOGIC ---
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.3, includeBase64: true }, (response) => {
      if (response.didCancel || response.errorMessage) return;
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const base64Image = `data:${asset.type};base64,${asset.base64}`;
        setProfile({ ...profile, photoUrl: base64Image });
      }
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await firestore().collection('faculty').doc(facultyId).set(profile, { merge: true });
      Alert.alert("Success", "Profile updated successfully.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg || theme.background}]}>
      <SharedHeader title="My Profile" navigation={navigation} theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        
        {/* PROFILE HEADER SECTION */}
        <View style={[styles.profileMainBox, {backgroundColor: theme.surface, borderRadius: 20, padding: 20, elevation: 3}]}>
          
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
              {profile.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={[styles.profileImage, {width: 120, height: 120, borderRadius: 60}]}/>
              ) : (
                <View style={[styles.avatarLarge, {width: 120, height: 120, borderRadius: 60, backgroundColor: theme.primary}]}><User color="#FFF" size={60}/></View>
              )}
              <View style={{position: 'absolute', bottom: 0, right: 5, backgroundColor: theme.primary, padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#FFF'}}>
  <Camera color="#FFF" size={18} />
</View>
            </TouchableOpacity>
            
            <Text style={[styles.profileName, {color: theme.textDark, marginTop: 15, fontSize: 22}]}>{profile.name || "Faculty Member"}</Text>
            <Text style={{color: theme.textLight}}>{facultyId}</Text>
          </View>

          {/* FACULTY INFO (Read-only data from Admin) */}
          <View style={{flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: theme.inputBg, paddingTop: 15, marginBottom: 25}}>
            <View style={{alignItems: 'center'}}>
              <Building2 color={theme.primary} size={20} />
              <Text style={{color: theme.textDark, fontWeight: 'bold', marginTop: 5}}>{profile.department || "N/A"}</Text>
              <Text style={{color: theme.textLight, fontSize: 12}}>Department</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Briefcase color={theme.primary} size={20} />
              <Text style={{color: theme.textDark, fontWeight: 'bold', marginTop: 5}}>{profile.designation || "Faculty"}</Text>
              <Text style={{color: theme.textLight, fontSize: 12}}>Designation</Text>
            </View>
          </View>

          <Text style={[styles.inputLabel, {color: theme.textDark, fontWeight: 'bold', marginBottom: 10}]}>Contact Information</Text>

          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark, borderRadius: 12}]} 
            placeholder="Phone Number" 
            placeholderTextColor={theme.textLight}
            value={profile.contact} 
            onChangeText={t => setProfile({...profile, contact: t})} 
            keyboardType="phone-pad"
          />

          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark, height: 100, borderRadius: 12}]} 
            placeholder="Full Residential Address" 
            placeholderTextColor={theme.textLight}
            value={profile.address} 
            onChangeText={t => setProfile({...profile, address: t})} 
            multiline 
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.actionBtn, {backgroundColor: theme.primary, borderRadius: 15, padding: 18, marginTop: 10}]} 
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.btnText, {fontSize: 16}]}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// --- 3. LOGIC SCREENS ---

const AttendanceScreen = ({ navigation }: any) => {
  const { theme, students, facultyId } = useContext(AppContext);
  const [att, setAtt] = useState<Record<string, string>>({});
  
  // --- SELECTION STATES ---
  const [selectedSem, setSelectedSem] = useState<string>('Sem 1');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  // --- DROPDOWN TOGGLE STATES ---
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [showSubDrop, setShowSubDrop] = useState(false);

  // --- DYNAMIC DATABASE STATES ---
  const [departments, setDepartments] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const snap = await firestore().collection('departments').get();
        const depts = snap.docs.map(doc => doc.data().code).filter(Boolean);
        
        if (depts.length === 0) {
          setDepartments(['BCA', 'BBA', 'B.Tech', 'B.Sc', 'MCA']); 
        } else {
          setDepartments(depts);
        }
      } catch (e) {
        console.log("Error fetching departments: ", e);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!selectedDept || !selectedSem) {
      setSubjects([]);
      return;
    }

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const snap = await firestore().collection('allocations')
          .where('facultyId', '==', facultyId)
          .where('course', '==', selectedDept)
          .where('sem', '==', selectedSem)
          .get();
        
        const allocatedSubs = snap.docs.map(doc => doc.data().subCode).filter(Boolean);
        
        if (allocatedSubs.length === 0) {
          const allSubSnap = await firestore().collection('subjects').get();
          const allSubs = allSubSnap.docs.map(doc => doc.data().name || doc.data().code).filter(Boolean);
          setSubjects(Array.from(new Set(allSubs)) as string[]);
        } else {
          setSubjects(Array.from(new Set(allocatedSubs)) as string[]);
        }
      } catch (e) {
        console.log("Error fetching subjects: ", e);
      }
      setLoadingSubjects(false);
    };

    fetchSubjects();
  }, [selectedDept, selectedSem, facultyId]);

  const filteredStudents = students.filter((s: any) => {
    const matchDept = s.department === selectedDept;
    const matchSem = s.semester === selectedSem || s.sem === selectedSem || !s.semester; 
    return matchDept && matchSem;
  });

  // --- SAVE ATTENDANCE ---
  const save = async () => {
    if (!selectedDept || !selectedSub) {
      return Alert.alert("Incomplete Info", "Please select a Department and Subject.");
    }

    const batch = firestore().batch();
    filteredStudents.forEach((s: any) => {
      const docRef = firestore().collection('student_attendance').doc();
      batch.set(docRef, { 
        studentId: s.studentId || s.id, 
        name: s.name, 
        status: att[s.id] || 'Present', // Will now save 'Present', 'Absent', or 'On Leave'
        date: new Date().toISOString(),
        semester: selectedSem,
        department: selectedDept,
        subject: selectedSub, 
        facultyId: facultyId
      });
    });

    try {
      await batch.commit();
      Alert.alert("Success", "Attendance Recorded Successfully!");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // --- TOGGLE ATTENDANCE STATUS ---
  const handleToggle = (studentId: string) => {
    const currentStatus = att[studentId] || 'Present';
    let nextStatus = 'Present';
    
    // 3-Way Toggle: Present -> Absent -> On Leave -> Present
    if (currentStatus === 'Present') nextStatus = 'Absent';
    else if (currentStatus === 'Absent') nextStatus = 'On Leave';
    else nextStatus = 'Present';

    setAtt({ ...att, [studentId]: nextStatus });
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="Mark Attendance" navigation={navigation} showBack theme={theme} />
      
      <ScrollView contentContainerStyle={styles.scrollBody} nestedScrollEnabled={true}>
        
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>1. Select Semester</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
            <TouchableOpacity 
              key={sem} 
              onPress={() => {
                setSelectedSem(sem);
                setSelectedSub(null); 
              }} 
              style={[styles.dayButton, {backgroundColor: selectedSem === sem ? theme.primary : theme.cardBg1}]}
            >
              <Text style={{color: selectedSem === sem ? '#FFF' : theme.textLight, fontWeight: 'bold'}}>{sem}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>2. Select Department</Text>
        <TouchableOpacity 
          style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}
          onPress={() => setShowDeptDrop(!showDeptDrop)}
        >
          <Text style={{color: selectedDept ? theme.textDark : theme.textLight}}>
            {selectedDept || "Choose Department..."}
          </Text>
          {showDeptDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
        </TouchableOpacity>

        {showDeptDrop && (
          <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
            {departments.length === 0 ? <Text style={{color: theme.textLight, padding: 10}}>No departments found.</Text> : null}
            {departments.map((dept) => (
              <TouchableOpacity 
                key={dept} 
                style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}}
                onPress={() => {
                  setSelectedDept(dept);
                  setSelectedSub(null); 
                  setShowDeptDrop(false);
                }}
              >
                <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{dept}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedDept && (
          <>
            <Text style={[styles.inputLabel, {color: theme.textDark}]}>3. Select Subject</Text>
            <TouchableOpacity 
              style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}
              onPress={() => setShowSubDrop(!showSubDrop)}
            >
              <Text style={{color: selectedSub ? theme.textDark : theme.textLight}}>
                {loadingSubjects ? "Loading subjects..." : (selectedSub || "Choose Subject...")}
              </Text>
              {showSubDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
            </TouchableOpacity>

            {showSubDrop && !loadingSubjects && (
              <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
                {subjects.length === 0 ? <Text style={{color: theme.textLight, padding: 10}}>No subjects assigned.</Text> : null}
                {subjects.map((sub) => (
                  <TouchableOpacity 
                    key={sub} 
                    style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}}
                    onPress={() => {
                      setSelectedSub(sub);
                      setShowSubDrop(false);
                    }}
                  >
                    <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {selectedSub && (
          <View style={{marginTop: 20}}>
            <Text style={[styles.sectionTitle, {color: theme.textDark}]}>
              Students List ({filteredStudents.length})
            </Text>
            
            {filteredStudents.length === 0 ? (
              <View style={[styles.manualCard, {backgroundColor: theme.surface, alignItems: 'center', padding: 30}]}>
                <Text style={{color: theme.textLight}}>No students enrolled in {selectedDept} - {selectedSem}.</Text>
              </View>
            ) : (
              filteredStudents.map((s:any) => {
                const currentStatus = att[s.id] || 'Present';
                // Dynamic colors for 3 states
                const bgColor = currentStatus === 'Absent' ? '#FF6B6B' : currentStatus === 'On Leave' ? '#FFA500' : '#4CAF50';

                return (
                  <TouchableOpacity 
                    key={s.id} 
                    style={[styles.manualCard, {backgroundColor: theme.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} 
                    onPress={() => handleToggle(s.id)}
                  >
                    <View>
                      <Text style={{color: theme.textDark, fontWeight: 'bold', fontSize: 16}}>{s.name}</Text>
                      <Text style={{color: theme.textLight, fontSize: 12}}>{s.studentId || s.id}</Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: bgColor, 
                      paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, width: 100, alignItems: 'center'
                    }}>
                      <Text style={{color: '#FFF', fontWeight: 'bold'}}>
                        {currentStatus}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            {filteredStudents.length > 0 && (
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary, marginTop: 10}]} onPress={save}>
                <Text style={styles.btnText}>Submit Records</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const MarksEntryScreen = ({ navigation }: any) => {
  const { theme, facultyId, marksList, students } = useContext(AppContext);
  
  // --- STATES ---
  const [facultyDept, setFacultyDept] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]); 
  
  const [selectedSem, setSelectedSem] = useState('Sem 1');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedSubCode, setSelectedSubCode] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [marks, setMarks] = useState('');

  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [showSubDrop, setShowSubDrop] = useState(false);
  const [showStudentDrop, setShowStudentDrop] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. FETCH FACULTY PROFILE & ALL DEPARTMENTS
  useEffect(() => {
    const init = async () => {
      try {
        if (facultyId) {
          const facSnap = await firestore().collection('faculty').doc(facultyId).get();
          if (facSnap.exists()) {
            setFacultyDept(facSnap.data()?.department || '');
          }
        }
        const deptSnap = await firestore().collection('departments').get();
        const depts = deptSnap.docs.map(d => d.data().code).filter(Boolean);
        setDepartments(depts.length ? depts : ['IT', 'CE', 'BCA', 'BBA']);
      } catch (e) {
        console.log("Error fetching init data", e);
      }
    };
    init();
  }, [facultyId]);

  // 2. FETCH SUBJECTS BASED ON DEPT & SEM (For Subject Code)
  useEffect(() => {
    if (selectedDept && selectedSem) {
      const fetchSubs = async () => {
        try {
          const subSnap = await firestore().collection('subjects')
            .where('department', '==', selectedDept)
            .where('semester', '==', selectedSem)
            .get();
          const subs = subSnap.docs.map(d => ({ name: d.data().name, code: d.data().code }));
          setSubjects(subs);
        } catch (e) { console.log(e); }
      }
      fetchSubs();
    } else {
      setSubjects([]);
    }
  }, [selectedDept, selectedSem]);

  // --- SMART FILTER: RULE ENFORCEMENT ---
  const availableDepartments = departments.filter(dept => {
    const isFirstYear = selectedSem === 'Sem 1' || selectedSem === 'Sem 2';
    if (isFirstYear) return true; // Allowed to select any department in Sem 1 & 2
    
    // For Sem 3-6: Match exactly with their own department 
    // (Handles "IT" vs "Information Technology" edge case)
    const myDept = facultyDept.toLowerCase().trim();
    const targetDept = dept.toLowerCase().trim();
    
    return targetDept === myDept || 
           (targetDept === 'it' && myDept === 'information technology') ||
           (targetDept === 'information technology' && myDept === 'it');
  });

  // Filter existing students based on Dept & Sem selection
  const filteredStudents = (students || []).filter((s: any) => {
    const semMatches = s.semester === selectedSem || s.semester === selectedSem.replace('Sem ', '');
    return semMatches && s.department === selectedDept;
  });

  // Reset selections when semester changes
  const handleSemChange = (sem: string) => {
    setSelectedSem(sem);
    setSelectedDept(null);
    setSelectedSubCode(null);
    setSelectedStudent(null);
  };

  const upload = async () => {
    if (!selectedStudent || !selectedSubCode || !marks) {
      return Alert.alert("Error", "Please complete all selections and enter marks.");
    }
    setLoading(true);
    try {
      await firestore().collection('student_marks').add({
        studentId: selectedStudent.studentId || selectedStudent.id,
        studentName: selectedStudent.name,
        subject: selectedSubCode, // Main identifier for student side
        subCode: selectedSubCode, 
        semester: selectedSem,
        department: selectedDept,
        marks: marks,
        facultyId,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", "Marks Uploaded Successfully!");
      setSelectedStudent(null);
      setMarks('');
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="Marks Entry" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollBody} nestedScrollEnabled={true}>
        
        {/* 1. SEMESTER SELECTION */}
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>1. Select Semester</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
            <TouchableOpacity 
              key={sem} 
              onPress={() => handleSemChange(sem)} 
              style={[styles.dayButton, {backgroundColor: selectedSem === sem ? theme.primary : theme.cardBg1}]}
            >
              <Text style={{color: selectedSem === sem ? '#FFF' : theme.textLight, fontWeight: 'bold'}}>{sem}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 2. DEPARTMENT SELECTION (Smart Filtered) */}
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>2. Select Department</Text>
        <TouchableOpacity style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={() => setShowDeptDrop(!showDeptDrop)}>
          <Text style={{color: selectedDept ? theme.textDark : theme.textLight}}>{selectedDept || "Choose Department..."}</Text>
          {showDeptDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
        </TouchableOpacity>
        {showDeptDrop && (
          <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
            {availableDepartments.length === 0 ? <Text style={{color: theme.textLight}}>No departments available.</Text> : null}
            {availableDepartments.map(dept => (
              <TouchableOpacity key={dept} style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}} onPress={() => { setSelectedDept(dept); setShowDeptDrop(false); }}>
                <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{dept}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedDept && (
          <>
            {/* 3. SUBJECT CODE SELECTION */}
            <Text style={[styles.inputLabel, {color: theme.textDark}]}>3. Select Subject Code</Text>
            <TouchableOpacity style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={() => setShowSubDrop(!showSubDrop)}>
              <Text style={{color: selectedSubCode ? theme.textDark : theme.textLight}}>{selectedSubCode || "Choose Subject Code..."}</Text>
              {showSubDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
            </TouchableOpacity>
            {showSubDrop && (
              <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
                {subjects.length === 0 ? <Text style={{color: theme.textLight}}>No subjects found for this Sem/Dept.</Text> : null}
                {subjects.map(sub => (
                  <TouchableOpacity key={sub.code} style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}} onPress={() => { setSelectedSubCode(sub.code); setShowSubDrop(false); }}>
                    <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{sub.code} ({sub.name})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 4. STUDENT SELECTION */}
            <Text style={[styles.inputLabel, {color: theme.textDark}]}>4. Select Student</Text>
            <TouchableOpacity style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={() => setShowStudentDrop(!showStudentDrop)}>
              <Text style={{color: selectedStudent ? theme.textDark : theme.textLight}}>{selectedStudent ? `${selectedStudent.name} (${selectedStudent.studentId || selectedStudent.id})` : "Choose Student..."}</Text>
              {showStudentDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
            </TouchableOpacity>
            {showStudentDrop && (
              <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
                {filteredStudents.length === 0 ? <Text style={{color: theme.textLight}}>No students registered in this Sem/Dept.</Text> : null}
                {filteredStudents.map((s: any) => (
                  <TouchableOpacity key={s.id} style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}} onPress={() => { setSelectedStudent(s); setShowStudentDrop(false); }}>
                    <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{s.name}</Text>
                    <Text style={{color: theme.textLight, fontSize: 12}}>{s.studentId || s.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 5. MARKS INPUT */}
            <Text style={[styles.inputLabel, {color: theme.textDark}]}>5. Marks Achieved</Text>
            <TextInput 
              style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
              placeholder="e.g. 19/30 or 85/100" 
              placeholderTextColor={theme.textLight} 
              value={marks} 
              onChangeText={setMarks}
            />

            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary}]} onPress={upload} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Submit Marks</Text>}
            </TouchableOpacity>
          </>
        )}

        {/* Existing Component Retained */}
        <DropdownBox title="Recent Uploads" id="marks" data={marksList} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MaterialUploadScreen = ({ navigation }: any) => {
  const { theme, courseFiles = [], facultyId } = useContext(AppContext); // Added default array
  const [form, setForm] = useState({ title: '', link: '', sem: 'Sem 1' });
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!form.title || !form.link) {
      return Alert.alert("Missing Info", "Please provide a title and Drive link.");
    }
    setLoading(true);
    try {
      await firestore().collection('course_files').add({
        ...form,
        facultyId,
        uploadedAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", "Study material shared successfully.");
      setForm({ title: '', link: '', sem: 'Sem 1' });
    } catch (e: any) { 
      Alert.alert("Upload Error", e.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="PYQ Upload" navigation={navigation} showBack theme={theme} />
      {/* FIXED: Changed scrollContent to scrollBody to match StyleSheet */}
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>Select Semester</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(s => (
            <TouchableOpacity key={s} onPress={() => setForm({...form, sem: s})} 
              style={[styles.dayButton, {backgroundColor: form.sem === s ? theme.primary : theme.cardBg1}]}>
              <Text style={{color: form.sem === s ? '#FFF' : theme.textLight}}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>Document Title</Text>
        <TextInput 
          style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
          placeholder="e.g. Unit 2 Neural Networks Notes" 
          placeholderTextColor={theme.textLight}
          value={form.title} 
          onChangeText={t => setForm({...form, title: t})} 
        />

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>Google Drive Link</Text>
        <TextInput 
          style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
          placeholder="Paste URL here..." 
          placeholderTextColor={theme.textLight}
          value={form.link} 
          onChangeText={t => setForm({...form, link: t})} 
        />

        <TouchableOpacity 
          style={[styles.actionBtn, {backgroundColor: theme.primary}]} 
          onPress={handleUpload} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Upload Material</Text>}
        </TouchableOpacity>

        <View style={{marginTop: 30}}>
           <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Existing Materials</Text>
           <DropdownBox 
              title="Semester 1 Files" 
              id="s1" 
              data={Array.isArray(courseFiles) ? courseFiles.filter((f:any) => f.sem === 'Sem 1') : []} 
           />
           <DropdownBox 
              title="Semester 2 Files" 
              id="s2" 
              data={Array.isArray(courseFiles) ? courseFiles.filter((f:any) => f.sem === 'Sem 2') : []} 
           />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StudentLeavesScreen = ({ navigation }: any) => {
  const { theme, studentLeaves } = useContext(AppContext);
  const updateStatus = async (id:string, status:string) => { await firestore().collection('student_leaves').doc(id).update({status}); Alert.alert("Status Updated", `Request has been ${status}`); };
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="Student leaves" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Pending requests</Text>
        {studentLeaves.filter((r:any) => r.status === 'Pending').map((r:any) => (
          <View key={r.id} style={[styles.profileMainBox, {marginBottom: 15}]}>
            <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{r.studentName}</Text>
            <Text style={{color: theme.textLight}}>{r.reason}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <TouchableOpacity onPress={() => updateStatus(r.id, 'Approved')} style={{flex: 0.48, padding: 10, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center'}}><Text style={{color: '#FFF'}}>Approve</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => updateStatus(r.id, 'Denied')} style={{flex: 0.48, padding: 10, backgroundColor: '#FF6B6B', borderRadius: 8, alignItems: 'center'}}><Text style={{color: '#FFF'}}>Deny</Text></TouchableOpacity>
            </View>
          </View>
        ))}
        <DropdownBox title="Leave history" id="leaves_hist" data={studentLeaves.filter((r:any) => r.status !== 'Pending')} />
      </ScrollView>
    </SafeAreaView>
  );
};

const FacultyLeaveScreen = ({ navigation }: any) => {
  const { theme, facultyId, profile } = useContext(AppContext);
  // States to capture specific dates and duration
  const [form, setForm] = useState({ from: '', to: '', time: '', reason: '' });
  
  const apply = async () => {
    // Basic validation to ensure critical fields aren't empty
    if (!form.reason || !form.from || !form.to) {
      return Alert.alert("Error", "Please fill in the dates and reason for leave.");
    }

    try {
      // Saving to the 'faculty_leaves' collection used by the Admin side
      await firestore().collection('faculty_leaves').add({
        ...form,
        // Crucial: Passing the faculty name from the profile so Admin sees it
        name: profile?.name || "Faculty Member", 
        employeeId: facultyId,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp()
      });

      Alert.alert("Success", "Leave application submitted to Admin.");
      // Reset form after successful submission
      setForm({ from: '', to: '', time: '', reason: '' });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <SharedHeader title="Apply Leave" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* Help text placeholders added to guide the faculty */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput 
            style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textDark, width: '48%' }]} 
            placeholder="From (DD/MM)" 
            placeholderTextColor={theme.textLight}
            value={form.from} 
            onChangeText={t => setForm({ ...form, from: t })} 
          />
          <TextInput 
            style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textDark, width: '48%' }]} 
            placeholder="To (DD/MM)" 
            placeholderTextColor={theme.textLight}
            value={form.to} 
            onChangeText={t => setForm({ ...form, to: t })} 
          />
        </View>

        <TextInput 
          style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textDark }]} 
          placeholder="Total Duration (e.g., 3 Days)" 
          placeholderTextColor={theme.textLight}
          value={form.time} 
          onChangeText={t => setForm({ ...form, time: t })} 
        />

        <TextInput 
          style={[styles.inputField, { backgroundColor: theme.inputBg, color: theme.textDark, height: 120, textAlignVertical: 'top' }]} 
          multiline 
          placeholder="Reason for leave (e.g., Family function)..." 
          placeholderTextColor={theme.textLight}
          value={form.reason} 
          onChangeText={t => setForm({ ...form, reason: t })} 
        />

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={apply}>
          <Text style={styles.btnText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
// --- SUPPORTING SCREENS ---

const SettingsScreen = ({ navigation }: any) => {
  const { theme, isDarkMode, toggleTheme } = useContext(AppContext);
  const rootNav = useNavigation<any>();
  const handleLogout = () => {
    Alert.alert("Logout", "Sign out of your account?", [{ text: "Cancel", style: "cancel" }, { text: "Logout", style: "destructive", onPress: () => rootNav.reset({ index: 0, routes: [{ name: 'Login' }] }) }]);
  };
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="Settings" navigation={navigation} theme={theme} />
      <View style={styles.scrollBody}>
        <View style={[styles.settingItem, {backgroundColor: theme.surface}]}><Text style={{color: theme.textDark, fontSize: 16}}>Dark Mode</Text><Switch value={isDarkMode} onValueChange={toggleTheme} /></View>
        <TouchableOpacity style={[styles.settingItem, {backgroundColor: '#FF6B6B', marginTop: 30}]} onPress={handleLogout}><Text style={{color: '#FFF', fontSize: 16}}>Log Out</Text><LogOut color="#FFF" size={24} /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const LectureScreen = ({ navigation }: any) => {
  const { theme, lectures, facultyId } = useContext(AppContext);
  
  // --- SELECTION STATES ---
  const [selectedSem, setSelectedSem] = useState('Sem 1'); 
  const [day, setDay] = useState('Monday');
  
  // --- FETCHED DATA STATES ---
  const [myAllocations, setMyAllocations] = useState<any[]>([]);
  const [facultyDept, setFacultyDept] = useState<string>(''); // To store faculty's own department
  const [loading, setLoading] = useState(true);

  // 1. FETCH FACULTY PROFILE & ALLOCATIONS
  useEffect(() => {
    if (!facultyId) return;

    const fetchData = async () => {
      try {
        // Fetch Faculty's own department from their profile
        const profileSnap = await firestore().collection('faculty').doc(facultyId).get();
        if (profileSnap.exists()) {
          setFacultyDept(profileSnap.data()?.department || '');
        }

        // Fetch their specific admin-assigned allocations
        const allocSnap = await firestore()
          .collection('allocations')
          .where('facultyId', '==', facultyId)
          .get();
        
        const allocs = allocSnap.docs.map(doc => doc.data());
        setMyAllocations(allocs);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [facultyId]);

  // 2. SMART FILTERING LOGIC
  const filteredLectures = lectures.filter((lec: any) => {
    // 1. Basic Filters: Day and Semester must match the dropdown selection
    if (lec.day !== day) return false;
    if (lec.semester !== selectedSem) return false;

    const isFirstYear = selectedSem === 'Sem 1' || selectedSem === 'Sem 2';
    
    // 2. Check Allocations
    const isAllocated = myAllocations.some((alloc: any) => {
      // Handle '6' vs 'Sem 6' mismatch automatically
      const allocSemFormat = alloc.sem?.includes('Sem') ? alloc.sem : `Sem ${alloc.sem}`;
      const semMatches = allocSemFormat === lec.semester;

      // NAYA: Ab hum directly subCode ko subCode se match kar rahe hain
      const subjectMatches = alloc.subCode === lec.subCode || alloc.subCode === lec.subject;

      // Agar subCode exactly match ho gaya, toh department ki spelling (IT vs Information Technology) ignore kar do
      return semMatches && subjectMatches;
    });

    if (isFirstYear) {
      // Logic for Sem 1 & 2: Show ONLY if explicitly allocated
      return isAllocated;
    } else {
      // Logic for Sem 3-6: Show if it belongs to their OWN department OR if explicitly allocated
      const myDeptFormatted = facultyDept?.trim().toLowerCase();
      const lecDeptFormatted = lec.department?.trim().toLowerCase();
      
      const belongsToMyDept = myDeptFormatted === lecDeptFormatted && myDeptFormatted !== '';
      
      // Dono conditions me Information Technology aur IT ko same maanne ka jugaad:
      const isITMatch = (myDeptFormatted === 'information technology' && lecDeptFormatted === 'it') || 
                        (myDeptFormatted === 'it' && lecDeptFormatted === 'information technology');

      return belongsToMyDept || isITMatch || isAllocated;
    }
  });

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <SharedHeader title="My Schedule" navigation={navigation} theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        
        {/* --- SEMESTER SELECTOR --- */}
        <Text style={[styles.inputLabel, {color: theme.textDark, marginBottom: 10}]}>Select Semester</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
            <TouchableOpacity 
              key={sem} 
              onPress={() => setSelectedSem(sem)} 
              style={[styles.dayButton, {backgroundColor: selectedSem === sem ? theme.primary : theme.cardBg1}]}
            >
              <Text style={{color: selectedSem === sem ? '#FFF' : theme.textLight, fontWeight: 'bold'}}>{sem}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- DAY SELECTOR --- */}
        <Text style={[styles.inputLabel, {color: theme.textDark, marginBottom: 10}]}>Select Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
            <TouchableOpacity 
              key={d} 
              onPress={() => setDay(d)} 
              style={[styles.dayButton, {backgroundColor: day === d ? theme.primary : theme.cardBg1}]}
            >
              <Text style={{color: day === d ? '#FFF' : theme.textLight, fontWeight: 'bold'}}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- LECTURE LIST --- */}
        <View style={{marginTop: 10}}>
          {loading ? (
            <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
          ) : filteredLectures.length === 0 ? (
            <Text style={{ color: theme.textLight, textAlign: 'center', marginTop: 30 }}>
              No lectures scheduled for you on {day} for {selectedSem}.
            </Text>
          ) : (
            filteredLectures.map((lec: any, index: number) => (
              <View 
                key={lec.id || index} 
                style={[styles.manualCard, {backgroundColor: theme.surface, borderLeftWidth: 4, borderLeftColor: theme.primary}]}
              >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{color: theme.textDark, fontWeight: 'bold', fontSize: 18}}>
                    {lec.subject}
                  </Text>
                  
                  <View style={{backgroundColor: theme.inputBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8}}>
                    <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 12}}>
                      {lec.department} | {lec.semester}
                    </Text>
                  </View>
                </View>
                
                <Text style={{color: theme.textLight, marginTop: 8, fontWeight: '500'}}>
                  {lec.time}
                </Text>
                <Text style={{color: theme.textLight, marginTop: 2}}>
                  Room: {lec.room}
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- REUSABLE DROPDOWN COMPONENT (FIXED: Component defined and named correctly) ---
const DropdownBox = ({ title, id, data = [] }: { title: string, id: string, data?: any[] }) => {
  const { theme, expandedSection, setExpandedSection } = useContext(AppContext);
  return (
    <View style={styles.dropContainer}>
      <TouchableOpacity style={[styles.dropHeader, {backgroundColor: theme.surface}]} onPress={() => setExpandedSection(expandedSection === id ? null : id)}>
        <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{title}</Text>
        {expandedSection === id ? <ChevronUp color={theme.textLight} size={24}/> : <ChevronDown color={theme.textLight} size={24}/>}
      </TouchableOpacity>
      {expandedSection === id && (
        <View style={[styles.dropContent, {backgroundColor: theme.cardBg1}]}>
          {data.length > 0 ? data.map((item, i) => (
            <View key={i} style={[styles.historyItem, {borderBottomColor: theme.background}]}>
              <Text style={{color: theme.textDark}}>{item.subject || item.studentName || item.title || item.time || item.link}</Text>
              <Text style={{color: theme.textLight}}>{item.reason || item.marks || item.status}</Text>
            </View>
          )) : <Text style={{color: theme.textLight, textAlign: 'center'}}>No data.</Text>}
        </View>
      )}
    </View>
  );
};

// --- NAVIGATION COMPONENTS ---
const CustomTabBar = ({ state, navigation }: any) => {
  const { theme } = useContext(AppContext);
  const currentRoute = state.routes[state.index].name;
  return (
    <View style={styles.navWrapper}>
      <View style={[styles.bottomNav, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Lecture')}><Calendar color="#FFF" size={28} opacity={currentRoute === 'Lecture' ? 1 : 0.6}/></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StudyMaterial')}><BookOpen color="#FFF" size={28} opacity={currentRoute === 'StudyMaterial' ? 1 : 0.6}/></TouchableOpacity>
        <View style={[styles.fabOuter, {backgroundColor: theme.background}]}><TouchableOpacity style={[styles.fabInner, {backgroundColor: theme.primary}]} onPress={() => navigation.navigate('FacultyHome')}><HomeIcon color="#FFF" size={32}/></TouchableOpacity></View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Settings color="#FFF" size={28} opacity={currentRoute === 'Settings' ? 1 : 0.6}/></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}><User color="#FFF" size={28} opacity={currentRoute === 'Profile' ? 1 : 0.6}/></TouchableOpacity>
      </View>
    </View>
  );
};

export default function FacultyMasterClass({ route }: { route: any }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const facultyId = route?.params?.userId || "FAC101";

  // Data States
  const [students, setStudents] = useState<any[]>([]);
  const [allAttendance, setAllAttendance] = useState<any[]>([]); 
  const [studentLeaves, setStudentLeaves] = useState<any[]>([]);
  const [courseFiles, setCourseFiles] = useState<{sem1: any[], sem2: any[]}>({ sem1: [], sem2: [] });
  const [marksList, setMarksList] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null); 
  const [profile, setProfile] = useState<any>({ name: route?.params?.userName || 'Faculty', employeeId: facultyId, contact: '', address: '', photoUrl: '', photoSet: false });

  // Listeners
  useEffect(() => {
    const unsubProfile = firestore().collection('faculty').doc(facultyId).onSnapshot(doc => { if (doc.exists()) setProfile((prev:any) => ({ ...prev, ...doc.data() })); });
    const unsubStudents = firestore().collection('students').onSnapshot(snap => setStudents(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []));
    const unsubAllAtt = firestore().collection('student_attendance').onSnapshot(snap => setAllAttendance(snap ? snap.docs.map(doc => doc.data()) : []));
    const unsubStudentLeaves = firestore().collection('student_leaves').onSnapshot(snap => setStudentLeaves(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []));
    const unsubCourses = firestore().collection('course_files').onSnapshot(snap => { if (snap) { const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })); setCourseFiles({ sem1: docs.filter((d: any) => d.sem === 'Sem 1'), sem2: docs.filter((d: any) => d.sem === 'Sem 2'), }); } });
    const unsubMarks = firestore().collection('student_marks').where('facultyId', '==', facultyId).onSnapshot(snap => setMarksList(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []));
    const unsubLectures = firestore().collection('lectures').onSnapshot(snap => setLectures(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []));
    return () => { unsubProfile(); unsubStudents(); unsubAllAtt(); unsubStudentLeaves(); unsubCourses(); unsubMarks(); unsubLectures(); };
  }, [facultyId]);

  const defaulters = students.map(s => { const r = allAttendance.filter(a => a.studentId === s.id); const t = r.length; const p = r.filter(a => a.status === 'Present').length; const perc = t === 0 ? 100 : Math.round((p / t) * 100); return { ...s, percentage: perc, totalClasses: t }; }).filter(s => s.percentage < 50 && s.totalClasses > 0);

  return (
    <SafeAreaProvider>
      <AppContext.Provider value={{ theme, isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode), facultyId, students, allAttendance, studentLeaves, courseFiles, marksList, lectures, defaulters, profile, setProfile, expandedSection, setExpandedSection }}>
        <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
          <Tab.Screen name="FacultyHome" component={FacultyHomeScreen} />
          <Tab.Screen name="Lecture" component={LectureScreen} />
          <Tab.Screen name="StudyMaterial" component={MaterialUploadScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Profile" component={FacultyProfileScreen} />
          {/* Internal screens */}
          <Tab.Screen name="MarkAttendance" component={AttendanceScreen} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="MarksEntry" component={MarksEntryScreen} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="StudentLeaves" component={StudentLeavesScreen} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="ApplyLeave" component={FacultyLeaveScreen} options={{ tabBarButton: () => null }} />
        </Tab.Navigator>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollBody: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130 },
  topHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    height: 70,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 // <-- YEH LINE ADD KI HAI
  },  
  
  headerTitle: { fontSize: 20, fontWeight: '700' },
  iconBtn: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, marginTop: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dashCard: { width: '48%', height: 140, padding: 20, borderRadius: 25, marginBottom: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  dashCardTitle: { fontSize: 14, fontWeight: '700', marginTop: 15 },
  manualCard: { padding: 20, borderRadius: 20, marginBottom: 15, elevation: 1 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  inputField: { padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  actionBtn: { padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  navWrapper: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    elevation: 0, // Removes shadow from wrapper
    backgroundColor: 'transparent'
  },
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    height: 75, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0, // Ensure it sticks to bottom corners
    borderBottomRightRadius: 0,
    marginBottom: 0 // Prevents floating
  },
  fabOuter: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginTop: -40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fabInner: { 
    width: 55, 
    height: 55, 
    borderRadius: 27.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5 
  },  
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 20, elevation: 1 },
  profileMainBox: { padding: 30, borderRadius: 30, elevation: 2 },
  profileName: { fontSize: 24, fontWeight: '700', marginBottom: 5, textAlign: 'center' },
  avatarLarge: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#6772E5', alignSelf: 'center', marginBottom: 15, justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 90, height: 90, borderRadius: 45, alignSelf: 'center', marginBottom: 15 },
  dropContainer: { marginBottom: 15 },
  dropHeader: { padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropContent: { padding: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, marginTop: -10, paddingTop: 25 },
  historyItem: { paddingVertical: 10, borderBottomWidth: 0.5 },
  daySelector: { flexDirection: 'row', marginBottom: 20 },
  dayButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
});