import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, 
  ScrollView, Dimensions, Modal, StatusBar, Switch, TextInput, Alert, Image 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const LIGHT_THEME = {
  background: '#D1DCE8',
  header: '#82B7FF',
  cardGradients: ['#C2E0FF', '#99C2FF'],
  textPrimary: '#3B6A9F',
  underline: '#3B6A9F',
  accent: '#4A7FB5',
  modalInner: '#99C2FF',
  navActive: '#FFFFFF',
  dayPill: '#4A80B5'
};

const DARK_THEME = {
    background: '#0F172A',                 // Main dark navy background
    header: '#1E293B',                     // Top header and bottom nav bar
    cardGradients: ['#334155', '#334155'], // Flat slate-gray for the menu pills
    textPrimary: '#94A3B8',                // Muted grayish-blue text
    underline: '#94A3B8',
    accent: '#1E293B',                     // Background for expanded modals/boxes
    modalInner: '#334155',                 // Inner elements inside modals
    navActive: '#E2E8F0',                  // Bright white/gray for active icons
    dayPill: '#334155'                     // Unselected day pills on Lecture screen
  };

// --- TYPESCRIPT INTERFACES ---
interface LeaveForm {
  from: string;
  to: string;
  time: string;
  reason: string;
}

interface FacultyForm {
  name: string;
  department: string;
  photoUrl: string; 
}

interface DocumentForm {
  title: string;
  link: string;
}

interface FirestoreRecord {
  id: string;
  [key: string]: any;
}

interface Student {
  id: string;
  name?: string;
  [key: string]: any;
}

export default function FacultyMasterClass() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [expandedSection, setExpandedSection] = useState<string | null>(null); 
  const [activeModal, setActiveModal] = useState<string | null>(null); 
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showLeaveSuccess, setShowLeaveSuccess] = useState<boolean>(false);

  // --- MOCK FACULTY ID (Used to prevent duplicates) ---
  const FACULTY_DOC_ID = 'MY_FACULTY_PROFILE_001';

  // --- FIREBASE STATES ---
  const [students, setStudents] = useState<Student[]>([]);
  const [allAttendance, setAllAttendance] = useState<any[]>([]); 
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, string>>({}); 
  
  const [facultyLeaves, setFacultyLeaves] = useState<FirestoreRecord[]>([]);
  const [studentLeaves, setStudentLeaves] = useState<FirestoreRecord[]>([]);
  const [courseFiles, setCourseFiles] = useState<{sem1: FirestoreRecord[], sem2: FirestoreRecord[]}>({ sem1: [], sem2: [] });
  const [facultyDocs, setFacultyDocs] = useState<FirestoreRecord[]>([]);
  const [marksList, setMarksList] = useState<FirestoreRecord[]>([]);
  
  // --- LECTURE STATES (NEW) ---
  const [lectures, setLectures] = useState<FirestoreRecord[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<FirestoreRecord | null>(null);
  
  // --- FORM STATES ---
  const [leaveInput, setLeaveInput] = useState<LeaveForm>({ from: '', to: '', time: '', reason: '' });
  const [facultyInput, setFacultyInput] = useState<FacultyForm>({ name: '', department: '', photoUrl: '' });
  const [docInput, setDocInput] = useState<DocumentForm>({ title: '', link: '' });

  // --- ASSESSMENT STATES ---
  const [assessmentSem, setAssessmentSem] = useState<string>('Sem 1');
  const [assessmentSubject, setAssessmentSubject] = useState<string>('');
  const [studentMarks, setStudentMarks] = useState<Record<string, string>>({});

  const COLORS = isDarkMode ? DARK_THEME : LIGHT_THEME;

  // --- FIREBASE FETCHING ---
  useEffect(() => {
    const unsubProfile = firestore().collection('faculty_details').doc(FACULTY_DOC_ID).onSnapshot(doc => {
      if (doc && doc.exists()) {
        const data = doc.data();
        setFacultyInput({
          name: data?.name || '',
          department: data?.department || '',
          photoUrl: data?.photoUrl || ''
        });
      }
    });

    const unsubStudents = firestore().collection('students').onSnapshot(snap => {
      setStudents(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)) : []);
    });

    const unsubAllAtt = firestore().collection('student_attendance').onSnapshot(snap => {
      setAllAttendance(snap ? snap.docs.map(doc => doc.data()) : []);
    });

    const unsubFacultyLeaves = firestore().collection('faculty_leaves').onSnapshot(snap => {
      setFacultyLeaves(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRecord)) : []);
    });

    const unsubStudentLeaves = firestore().collection('student_leaves').onSnapshot(snap => {
      setStudentLeaves(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRecord)) : []);
    });

    const unsubCourses = firestore().collection('course_files').onSnapshot(snap => {
        if (snap) {
          const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRecord));
          setCourseFiles({
            sem1: docs.filter((d: any) => d.semester === 'Sem 1' || d.sem === 'Sem 1'),
            sem2: docs.filter((d: any) => d.semester === 'Sem 2' || d.sem === 'Sem 2')
          });
        }
      });

    const unsubFacDocs = firestore().collection('faculty_documents').onSnapshot(snap => {
      setFacultyDocs(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRecord)) : []);
    });

    const unsubMarks = firestore().collection('student_marks').onSnapshot(snap => {
        setMarksList(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRecord)) : []);
    });

    // FETCH LECTURES
    const unsubLectures = firestore().collection('lectures').onSnapshot(snap => {
      setLectures(snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRecord)) : []);
    });

    return () => {
      unsubProfile();
      unsubStudents();
      unsubAllAtt();
      unsubFacultyLeaves();
      unsubStudentLeaves();
      unsubCourses();
      unsubFacDocs();
      unsubMarks(); 
      unsubLectures();
    };
  }, []); 

  // --- CALCULATE DEFAULTERS (< 50% Attendance) ---
  const defaulters = students.map(student => {
    const records = allAttendance.filter(a => a.studentId === student.id);
    const totalClasses = records.length;
    const presentClasses = records.filter(a => a.status === 'Present').length;
    const percentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);
    return { ...student, percentage, totalClasses };
  }).filter(student => student.percentage < 50 && student.totalClasses > 0);

  // --- FIREBASE ACTIONS ---
  
  const submitAssessmentMarks = async () => {
    if (!assessmentSubject) return Alert.alert("Error", "Please enter a subject name.");
    if (Object.keys(studentMarks).length === 0) return Alert.alert("Error", "Please enter marks for at least one student.");

    try {
      const batch = firestore().batch();
      Object.keys(studentMarks).forEach(studentId => {
        if (studentMarks[studentId]) { 
          const student = students.find(s => s.id === studentId);
          const ref = firestore().collection('student_marks').doc();
          batch.set(ref, {
            studentId,
            studentName: student?.name || 'Unknown',
            semester: assessmentSem,
            subject: assessmentSubject,
            marks: studentMarks[studentId],
            createdAt: firestore.FieldValue.serverTimestamp()
          });
        }
      });
      await batch.commit();
      Alert.alert("Success", "Mid-Exam Marks successfully uploaded!");
      setStudentMarks({}); 
      setAssessmentSubject(''); 
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const submitFacultyLeave = async () => {
    if (!leaveInput.reason) return Alert.alert("Error", "Please provide a reason.");
    try {
      await firestore().collection('faculty_leaves').add({
        ...leaveInput,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp()
      });
      setShowLeaveSuccess(true);
      setLeaveInput({ from: '', to: '', time: '', reason: '' });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const processStudentLeave = async (id: string, newStatus: 'Approved' | 'Denied') => {
    try {
      await firestore().collection('student_leaves').doc(id).update({
        status: newStatus,
        processedAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", `Leave request has been ${newStatus.toLowerCase()}.`);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const submitAttendance = async () => {
    try {
      const batch = firestore().batch();
      students.forEach(s => {
        const ref = firestore().collection('student_attendance').doc();
        batch.set(ref, { 
          studentId: s.id, 
          name: s.name, 
          status: currentAttendance[s.id] || 'Present', 
          date: new Date().toISOString() 
        });
      });
      await batch.commit();
      Alert.alert("Success", "Today's Attendance Marked");
      setActiveModal(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const submitFacultyProfile = async () => {
    if (!facultyInput.name) return Alert.alert("Error", "Name is required");
    try {
      await firestore().collection('faculty_details').doc(FACULTY_DOC_ID).set({
        ...facultyInput,
        updatedAt: firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      Alert.alert("Success", "Profile details saved forever!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const submitFacultyDocument = async () => {
    if (!docInput.title || !docInput.link) return Alert.alert("Error", "Title and Link required");
    try {
      await firestore().collection('faculty_documents').add({
        ...docInput,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", "Document Uploaded");
      setDocInput({ title: '', link: '' });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // --- REUSABLE DROPDOWN ---
  const DropdownBox = ({ title, id, data = [] }: { title: string, id: string, data?: FirestoreRecord[] }) => (
    <View style={styles.dropContainer}>
      <TouchableOpacity 
        style={[styles.dropHeader, { backgroundColor: COLORS.header }]} 
        onPress={() => setExpandedSection(expandedSection === id ? null : id)}
      >
        <Text style={[styles.dropTitle, { color: COLORS.textPrimary }]}>{title}</Text>
        <Icon name={expandedSection === id ? "chevron-up" : "chevron-down"} color={COLORS.textPrimary} size={28} />
      </TouchableOpacity>
      {expandedSection === id && (
        <View style={[styles.dropContent, { backgroundColor: COLORS.accent }]}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={item.id || index} style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 5 }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {item.marks ? `${item.studentName} - ${item.subject}` : item.title || item.from ? `From: ${item.from} to ${item.to}` : item.fileName || item.title || 'Record'}
                </Text>
                <Text style={{color: 'white', fontSize: 12}}>
                  {item.marks ? `Marks: ${item.marks} | Sem: ${item.semester}` : item.status ? `Status: ${item.status}` : (item.link || item.reason || 'N/A')}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>No data available.</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- HEADER --- */}
      <View style={[styles.header, { backgroundColor: COLORS.header }]}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Icon name="menu" color={COLORS.textPrimary} size={38} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>
          {activeScreen.toUpperCase()}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* --- HOME SCREEN --- */}
        {activeScreen === 'home' && (
          <>
            <TouchableOpacity style={styles.cardWrapper} onPress={() => setActiveScreen('lecture')}>
              <LinearGradient colors={COLORS.cardGradients} style={styles.cardGradient}>
                <Text style={[styles.cardText, { color: COLORS.textPrimary, fontSize: 32 }]}>Lecture</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardWrapper} onPress={() => setActiveScreen('faculty_leave')}>
              <LinearGradient colors={COLORS.cardGradients} style={styles.cardGradient}>
                <Text style={[styles.cardText, { color: COLORS.textPrimary, fontSize: 32 }]}>Leave Request</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardWrapper} onPress={() => setActiveScreen('counsellor')}>
              <LinearGradient colors={COLORS.cardGradients} style={styles.cardGradient}>
                <Text style={[styles.cardText, { color: COLORS.textPrimary, fontSize: 32 }]}>Student Leaves</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity style={[styles.cardWrapper, { width: '47%' }]} onPress={() => setActiveModal('mark_attendance')}>
                <LinearGradient colors={COLORS.cardGradients} style={styles.cardGradient}>
                  <Text style={[styles.cardText, { color: COLORS.textPrimary, fontSize: 18 }]}>Mark Attendance</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cardWrapper, { width: '47%' }]} onPress={() => setActiveModal('attendance_report')}>
                <LinearGradient colors={COLORS.cardGradients} style={styles.cardGradient}>
                  <Text style={[styles.cardText, { color: COLORS.textPrimary, fontSize: 18 }]}>Attendance Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* --- LECTURE SCREEN (UPDATED FOR STACK EFFECT) --- */}
        {activeScreen === 'lecture' && (
          <View style={{ padding: 5 }}>
            {/* Show Day List if no specific lecture is tapped */}
            {!selectedLecture ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <TouchableOpacity 
                      key={day} 
                      onPress={() => setSelectedDay(day)}
                      style={[styles.dayButton, { backgroundColor: selectedDay === day ? COLORS.header : COLORS.dayPill }]}
                    >
                      <Text style={styles.dayButtonText}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Fetched Lectures from Firebase */}
                <View style={{ marginTop: 10 }}>
                  {lectures.filter(l => l.day === selectedDay).length === 0 ? (
                     <View style={{ backgroundColor: COLORS.header, padding: 20, borderRadius: 15, alignItems: 'center' }}>
                       <Text style={{color: COLORS.textPrimary, fontWeight: 'bold'}}>No lectures scheduled for {selectedDay}.</Text>
                     </View>
                  ) : (
                    lectures.filter(l => l.day === selectedDay).map(lec => (
                      <TouchableOpacity 
                        key={lec.id} 
                        style={[styles.cardWrapper, { backgroundColor: COLORS.header, padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                        onPress={() => setSelectedLecture(lec)}
                      >
                        <View>
                          <Text style={{color: COLORS.textPrimary, fontWeight: 'bold', fontSize: 18}}>{lec.subject}</Text>
                          <Text style={{color: COLORS.textPrimary}}>{lec.time} | Room: {lec.room}</Text>
                        </View>
                        <Icon name="chevron-right" color={COLORS.textPrimary} size={30} />
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </>
            ) : (
              /* THE "STACK NAVIGATION" DETAILS VIEW */
              <View style={[styles.cardWrapper, { backgroundColor: COLORS.accent, padding: 20, borderRadius: 20 }]}>
                <TouchableOpacity onPress={() => setSelectedLecture(null)} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 25}}>
                  <Icon name="arrow-left" color="white" size={24} />
                  <Text style={{color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold'}}>Back to Schedule</Text>
                </TouchableOpacity>
                
                <Text style={{color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 15}}>{selectedLecture.subject}</Text>
                
                <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 15, marginBottom: 25 }}>
                  <Text style={{color: 'white', fontSize: 16, marginBottom: 8}}><Text style={{fontWeight:'bold'}}>Time:</Text> {selectedLecture.time}</Text>
                  <Text style={{color: 'white', fontSize: 16, marginBottom: 8}}><Text style={{fontWeight:'bold'}}>Room:</Text> {selectedLecture.room}</Text>
                  <Text style={{color: 'white', fontSize: 16, marginBottom: 8}}><Text style={{fontWeight:'bold'}}>Semester:</Text> {selectedLecture.semester}</Text>
                  <Text style={{color: 'white', fontSize: 16}}><Text style={{fontWeight:'bold'}}>Day:</Text> {selectedLecture.day}</Text>
                </View>
                
                <TouchableOpacity style={[styles.formButton, { backgroundColor: COLORS.header }]} onPress={() => Alert.alert('Action', `Starting ${selectedLecture.subject} class...`)}>
                  <Text style={{color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold'}}>Start Lecture Session</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* --- COUNSELLOR SCREEN (REVIEW STUDENT LEAVES) --- */}
        {activeScreen === 'counsellor' && (
          <View style={{ padding: 5 }}>
            <Text style={{color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5}}>
              Pending Student Requests
            </Text>
            
            {studentLeaves.filter(req => req.status === 'Pending').length === 0 ? (
              <View style={[styles.formInput, { backgroundColor: COLORS.header, alignItems: 'center' }]}>
                <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>No pending leave requests.</Text>
              </View>
            ) : (
              studentLeaves.filter(req => req.status === 'Pending').map(req => (
                <View key={req.id} style={[styles.cardWrapper, { backgroundColor: COLORS.header, padding: 20, borderRadius: 20, marginBottom: 15 }]}>
                  <Text style={{color: COLORS.textPrimary, fontWeight: 'bold', fontSize: 18, marginBottom: 5}}>
                    Student: {req.studentName || 'Student'}
                  </Text>
                  <Text style={{color: COLORS.textPrimary}}>From: {req.from}   To: {req.to}</Text>
                  <Text style={{color: COLORS.textPrimary}}>Duration: {req.time}</Text>
                  <Text style={{color: COLORS.textPrimary, marginTop: 10, fontStyle: 'italic'}}>Reason: {req.reason}</Text>
                  
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                    <TouchableOpacity 
                      style={{backgroundColor: '#4CAF50', padding: 12, borderRadius: 12, flex: 0.48, alignItems: 'center', elevation: 3}} 
                      onPress={() => processStudentLeave(req.id, 'Approved')}
                    >
                      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{backgroundColor: '#FF6B6B', padding: 12, borderRadius: 12, flex: 0.48, alignItems: 'center', elevation: 3}} 
                      onPress={() => processStudentLeave(req.id, 'Denied')}
                    >
                      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Deny</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            
            <View style={{marginTop: 20}}>
              <DropdownBox 
                title="Processed Requests" 
                id="leave_report" 
                data={studentLeaves.filter(req => req.status !== 'Pending')} 
              />
            </View>
          </View>
        )}

        {/* --- SETTINGS SCREEN --- */}
        {activeScreen === 'setting' && (
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity style={[styles.settingPill, { backgroundColor: COLORS.header }]} onPress={() => setShowPasswordModal(true)}>
              <Text style={[styles.settingPillText, { color: COLORS.textPrimary }]}>Change Password</Text>
              <Icon name="arrow-right" color={COLORS.textPrimary} size={28} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingPill, { backgroundColor: COLORS.header }]} onPress={() => setActiveScreen('faculty_leave')}>
              <Text style={[styles.settingPillText, { color: COLORS.textPrimary }]}>Leave Application</Text>
              <Icon name="arrow-right" color={COLORS.textPrimary} size={28} />
            </TouchableOpacity>
            
            <View style={[styles.settingPill, { backgroundColor: COLORS.header }]}>
              <Text style={[styles.settingPillText, { color: COLORS.textPrimary }]}>Dark Mode</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
          </View>
        )}

        {/* --- FACULTY LEAVE SCREEN --- */}
        {activeScreen === 'faculty_leave' && (
          <View style={{ padding: 5 }}>
            <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="From :" value={leaveInput.from} onChangeText={t => setLeaveInput({...leaveInput, from: t})} />
            <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="To :" value={leaveInput.to} onChangeText={t => setLeaveInput({...leaveInput, to: t})} />
            <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Time :" value={leaveInput.time} onChangeText={t => setLeaveInput({...leaveInput, time: t})} />
            
            <TextInput style={[styles.formInputLarge, { backgroundColor: COLORS.header, color: COLORS.textPrimary, textAlignVertical: 'top' }]} placeholderTextColor={COLORS.textPrimary} placeholder="Reason :" multiline value={leaveInput.reason} onChangeText={t => setLeaveInput({...leaveInput, reason: t})} />
            
            <TouchableOpacity style={[styles.formButton, { backgroundColor: COLORS.header }]} onPress={submitFacultyLeave}>
              <Text style={{color: COLORS.textPrimary, fontSize: 20}}>Apply for Leave</Text>
            </TouchableOpacity>
            
            <DropdownBox title="My Leave History" id="faculty_report" data={facultyLeaves} />
          </View>
        )}

        {/* --- PROFILE (Add Faculty Details & Documents) --- */}
        {activeScreen === 'profile' && (
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.profileMainBox, { backgroundColor: COLORS.accent }]}>
              
              {/* PROFILE PICTURE DISPLAY */}
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                {facultyInput.photoUrl ? (
                  <Image source={{ uri: facultyInput.photoUrl }} style={styles.profilePicImage} />
                ) : (
                  <View style={[styles.profilePicPlaceholder, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Icon name="camera-plus" size={40} color="#999" />
                  </View>
                )}
              </View>

              <Text style={{color: 'white', fontWeight: 'bold', marginTop: 15, marginBottom: 5}}>Update Details</Text>
              <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Faculty Name" value={facultyInput.name} onChangeText={t => setFacultyInput({...facultyInput, name: t})} />
              <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Department" value={facultyInput.department} onChangeText={t => setFacultyInput({...facultyInput, department: t})} />
              <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Profile Photo URL (Paste Link Here)" value={facultyInput.photoUrl} onChangeText={t => setFacultyInput({...facultyInput, photoUrl: t})} />
              
              <TouchableOpacity style={[styles.formButton, { backgroundColor: COLORS.header, width: '100%', padding: 12, marginTop: 0 }]} onPress={submitFacultyProfile}>
                <Text style={{color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold'}}>Save Details</Text>
              </TouchableOpacity>

              <Text style={{color: 'white', fontWeight: 'bold', marginTop: 15, marginBottom: 5}}>Upload Document</Text>
              <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Document Title (e.g. Resume)" value={docInput.title} onChangeText={t => setDocInput({...docInput, title: t})} />
              <TextInput style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Document Link (Drive URL)" value={docInput.link} onChangeText={t => setDocInput({...docInput, link: t})} />
              <TouchableOpacity style={[styles.formButton, { backgroundColor: COLORS.header, width: '100%', padding: 12, marginTop: 0 }]} onPress={submitFacultyDocument}>
                <Text style={{color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold'}}>Upload Document</Text>
              </TouchableOpacity>

            </View>
            <DropdownBox title="My Documents" id="docs" data={facultyDocs} />
          </View>
        )}
        
        {/* --- COURSE UPLOAD SCREEN --- */}
        {activeScreen === 'course' && (
          <View style={{ marginTop: 10 }}>
             <View style={{ marginBottom: 20, backgroundColor: COLORS.header, padding: 20, borderRadius: 20 }}>
               <Text style={{ color: COLORS.textPrimary, fontSize: 18, marginBottom: 15, fontWeight: 'bold' }}>Upload Material / PYQ</Text>
               <TextInput style={[styles.formInput, { backgroundColor: COLORS.background, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Document Title" />
               <TextInput style={[styles.formInput, { backgroundColor: COLORS.background, color: COLORS.textPrimary }]} placeholderTextColor={COLORS.textPrimary} placeholder="Google Drive Link" />
               <TouchableOpacity style={[styles.formButton, { backgroundColor: COLORS.accent, marginTop: 5 }]} onPress={() => Alert.alert("Success", "File Uploaded to Firestore")}>
                  <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Upload File</Text>
               </TouchableOpacity>
            </View>

            <DropdownBox title="Sem 1 Files" id="sem1" data={courseFiles.sem1} />
            <DropdownBox title="Sem 2 Files" id="sem2" data={courseFiles.sem2} />
          </View>
        )}

        {/* --- ASSESSMENT SCREEN --- */}
        {activeScreen === 'assessment' && (
        <View style={{ padding: 5 }}>
              <Text style={{color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5}}>
                Mid-Exam Marks Entry
              </Text>

              {/* Semester Toggles */}
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
                <TouchableOpacity onPress={() => setAssessmentSem('Sem 1')} style={{padding: 12, backgroundColor: assessmentSem === 'Sem 1' ? COLORS.header : COLORS.dayPill, borderRadius: 15, flex: 0.48, alignItems: 'center'}}>
                  <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Semester 1</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAssessmentSem('Sem 2')} style={{padding: 12, backgroundColor: assessmentSem === 'Sem 2' ? COLORS.header : COLORS.dayPill, borderRadius: 15, flex: 0.48, alignItems: 'center'}}>
                  <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Semester 2</Text>
                </TouchableOpacity>
              </View>

              {/* Subject Input */}
              <TextInput 
                style={[styles.formInput, { backgroundColor: COLORS.header, color: COLORS.textPrimary }]} 
                placeholderTextColor={COLORS.textPrimary} 
                placeholder="Enter Subject Name (e.g. Mathematics)" 
                value={assessmentSubject} 
                onChangeText={setAssessmentSubject} 
              />

              {/* Student List with Marks Input */}
              <View style={{ backgroundColor: COLORS.header, borderRadius: 20, padding: 15, maxHeight: 350, marginTop: 5 }}>
                 <Text style={{color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: 10}}>Student Roster:</Text>
                 <ScrollView nestedScrollEnabled={true}>
                   {students.map(s => (
                     <View key={s.id} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 10}}>
                       <Text style={{color: COLORS.textPrimary, fontSize: 16, flex: 1, fontWeight: '500'}}>{s.name || 'Student'}</Text>
                       <TextInput
                         style={{backgroundColor: COLORS.background, color: COLORS.textPrimary, borderRadius: 10, width: 80, padding: 10, textAlign: 'center', fontWeight: 'bold'}}
                         placeholder="Marks"
                         placeholderTextColor="#999"
                         keyboardType="numeric"
                         value={studentMarks[s.id] || ''}
                         onChangeText={t => setStudentMarks({...studentMarks, [s.id]: t})}
                       />
                     </View>
                   ))}
                   {students.length === 0 && <Text style={{color: COLORS.textPrimary, textAlign: 'center'}}>No students found.</Text>}
                 </ScrollView>
              </View>

              <TouchableOpacity style={[styles.formButton, { backgroundColor: COLORS.accent, marginTop: 15 }]} onPress={submitAssessmentMarks}>
                 <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Submit All Marks</Text>
              </TouchableOpacity>

              <DropdownBox title="Recent Marks Uploaded" id="marks_report" data={marksList} />
            </View>
        )}

      </ScrollView>

      {/* --- MODALS --- */}

      {/* 1. Mark Attendance Modal */}
      {activeModal === 'mark_attendance' && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: COLORS.accent }]}>
              <Text style={styles.modalTitle}>MARK ATTENDANCE</Text>
              <View style={[styles.modalInnerBox, { backgroundColor: COLORS.modalInner }]}>
                <ScrollView>
                  {students.map(s => (
                    <TouchableOpacity 
                      key={s.id} 
                      style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)'}}
                      onPress={() => setCurrentAttendance({...currentAttendance, [s.id]: currentAttendance[s.id] === 'Absent' ? 'Present' : 'Absent'})}
                    >
                      <Text style={{color: COLORS.textPrimary, fontSize: 18}}>{s.name || 'Student'}</Text>
                      <Text style={{color: currentAttendance[s.id] === 'Absent' ? '#FF6B6B' : 'green', fontWeight: 'bold'}}>{currentAttendance[s.id] || 'Present'}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.header, marginTop: 10 }]} onPress={submitAttendance}>
                  <Text style={{color: COLORS.textPrimary, fontWeight: 'bold'}}>Submit Attendance</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}><Text style={{color: COLORS.textPrimary, fontSize: 20}}>Close</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 2. Attendance Defaulter Report (< 50%) */}
      {activeModal === 'attendance_report' && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: COLORS.accent }]}>
              <Text style={styles.modalTitle}>DEFAULTERS (&lt; 50%)</Text>
              <View style={[styles.modalInnerBox, { backgroundColor: COLORS.modalInner, padding: 10 }]}>
                <ScrollView>
                  {defaulters.length === 0 ? (
                    <Text style={{textAlign: 'center', color: COLORS.textPrimary, marginTop: 20, fontWeight: 'bold'}}>No students below 50% attendance!</Text>
                  ) : (
                    defaulters.map(d => (
                      <View key={d.id} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: COLORS.header, borderRadius: 15, marginBottom: 10}}>
                        <View>
                          <Text style={{color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold'}}>{d.name || 'Student'}</Text>
                          <Text style={{color: COLORS.textPrimary, fontSize: 12}}>Total Classes: {d.totalClasses}</Text>
                        </View>
                        <View style={{backgroundColor: '#FF6B6B', padding: 10, borderRadius: 10, justifyContent: 'center'}}>
                          <Text style={{color: 'white', fontWeight: 'bold'}}>{d.percentage}%</Text>
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}><Text style={{color: COLORS.textPrimary, fontSize: 20}}>Close</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 3. Leave Success Modal */}
      <Modal transparent visible={showLeaveSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.successModalContainer, { backgroundColor: COLORS.background }]}>
            <Text style={[styles.successText, { color: COLORS.header }]}>Leave request{"\n"}sent successfully</Text>
            <Icon name="check-circle" color={COLORS.header} size={60} style={{ marginVertical: 20 }} />
            <TouchableOpacity style={[styles.passCloseBtn, { backgroundColor: COLORS.header, width: '80%' }]} onPress={() => setShowLeaveSuccess(false)}>
              <Text style={[styles.passCloseText, { color: COLORS.textPrimary, fontSize: 22 }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Password Modal */}
      <Modal transparent visible={showPasswordModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.passModalContainer, { backgroundColor: COLORS.background }]}>
            <View style={{ width: '100%', padding: 20 }}>
              {['Old Password :', 'New Password :', 'Confirm Password :'].map((label, idx) => (
                <View key={idx} style={[styles.passInputPill, { backgroundColor: COLORS.header }]}>
                  <Text style={{ color: COLORS.textPrimary }}>{label}</Text>
                </View>
              ))}
              <TouchableOpacity><Text style={styles.tryAnotherText}>Try another way</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.passCloseBtn, { backgroundColor: COLORS.header }]} onPress={() => setShowPasswordModal(false)}>
                <Text style={[styles.passCloseText, { color: COLORS.textPrimary }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- DRAWER --- */}
      <Modal visible={drawerOpen} transparent animationType="none">
        <View style={styles.drawerRow}>
          <View style={[styles.drawerContent, { backgroundColor: COLORS.background }]}>
            <View style={[styles.drawerHeader, { backgroundColor: COLORS.header }]}><Icon name="menu" color="white" size={35} /></View>
            {['Home', 'Counsellor', 'Assessment', 'Course', 'Setting'].map((item) => (
              <TouchableOpacity key={item} style={styles.drawerItem} onPress={() => { setActiveScreen(item.toLowerCase()); setDrawerOpen(false); }}>
                <Text style={[styles.drawerItemText, { color: COLORS.textPrimary }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} onPress={() => setDrawerOpen(false)} />
        </View>
      </Modal>

      {/* --- NAV BAR --- */}
      <View style={styles.navWrapper}>
        <LinearGradient colors={isDarkMode ? ['#24243E', '#1A1A2E'] : ['#82B7FF', '#75AFFF']} style={styles.navBar}>
          <TouchableOpacity onPress={() => {setActiveScreen('lecture'); setSelectedLecture(null);}}><Icon name="book-open-page-variant" color={activeScreen === 'lecture' || activeScreen === 'faculty_leave' ? COLORS.navActive : COLORS.textPrimary} size={28} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveScreen('home')}><Icon name="home" color={activeScreen === 'home' ? COLORS.navActive : COLORS.textPrimary} size={28} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveScreen('profile')}><Icon name="account" color={activeScreen === 'profile' ? COLORS.navActive : COLORS.textPrimary} size={28} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveScreen('course')}><Icon name="file-document-outline" color={activeScreen === 'course' ? COLORS.navActive : COLORS.textPrimary} size={28} /></TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, marginLeft: 15, fontWeight: 'bold' },
  scrollBody: { padding: 15, paddingBottom: 120 },
  cardWrapper: { marginBottom: 15, borderRadius: 25, overflow: 'hidden', elevation: 5 },
  cardGradient: { paddingVertical: 40, alignItems: 'center' },
  cardText: { fontWeight: 'bold', textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  successModalContainer: { width: width * 0.8, borderRadius: 40, alignItems: 'center', padding: 30, elevation: 20 },
  successText: { fontSize: 22, textAlign: 'center', lineHeight: 30, fontWeight: 'bold' },
  settingPill: { flexDirection: 'row', justifyContent: 'space-between', padding: 22, borderRadius: 40, alignItems: 'center', marginBottom: 15, paddingHorizontal: 30 },
  settingPillText: { fontSize: 24, fontWeight: '600' },
  passModalContainer: { width: width * 0.9, borderRadius: 40, alignItems: 'center', elevation: 20, paddingVertical: 10 },
  passInputPill: { padding: 18, borderRadius: 30, marginBottom: 15 },
  tryAnotherText: { textAlign: 'center', color: '#666', marginBottom: 20 },
  passCloseBtn: { padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  passCloseText: { fontSize: 28, fontWeight: 'bold' },
  formInput: { padding: 12, borderRadius: 15, marginBottom: 10 },
  formInputLarge: { padding: 18, borderRadius: 20, height: 120, marginBottom: 12 },
  formButton: { padding: 18, borderRadius: 25, alignItems: 'center', marginVertical: 15, elevation: 3 },
  daySelector: { flexDirection: 'row', marginBottom: 20 },
  dayButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  dayButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  lectureContentBox: { width: '100%', height: height * 0.6, borderRadius: 25 },
  profileMainBox: { width: '100%', borderRadius: 30, marginBottom: 20, padding: 30 },
  profilePicPlaceholder: { width: 100, height: 100, backgroundColor: '#D9D9D9', borderRadius: 50, alignSelf: 'center' },
  profilePicImage: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  dropContainer: { marginVertical: 10, width: '100%' },
  dropHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderRadius: 20, alignItems: 'center' },
  dropTitle: { fontSize: 22, fontWeight: 'bold' },
  dropContent: { padding: 30, paddingTop: 40, marginTop: -15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, zIndex: -1 },
  navWrapper: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center', zIndex: 100 },
  navBar: { width: width * 0.9, height: 65, borderRadius: 35, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: width * 0.85, height: height * 0.75, borderRadius: 30, padding: 15 },
  modalTitle: { fontSize: 22, color: 'white', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  modalInnerBox: { flex: 1, borderRadius: 25, padding: 15 },
  formText: { fontSize: 18, marginBottom: 10, fontWeight: '500' },
  remarkBox: { height: 80, borderRadius: 15, marginBottom: 10 },
  actionBtn: { padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  closeBtn: { marginTop: 15, padding: 10, borderRadius: 15, alignItems: 'center', backgroundColor: '#82B7FF' },
  drawerRow: { flex: 1, flexDirection: 'row' },
  drawerContent: { width: width * 0.7, height: '100%' },
  drawerHeader: { height: 70, justifyContent: 'center', paddingHorizontal: 20 },
  drawerItem: { padding: 20 },
  drawerItemText: { fontSize: 22, fontWeight: '500' },
});