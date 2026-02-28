import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Switch, Alert, StatusBar, Platform, SafeAreaView, Dimensions, ActivityIndicator,
  Modal, Image
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import {
  Home as HomeIcon, User, ClipboardCheck,
  BookOpen, Calendar, ChevronLeft,
  Settings, BookPlus, Link, UserPlus, LogOut,
  Banknote, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  X, Trash2, Edit2
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const AppContext = createContext<any>(null);

// --- THEMES ---
const lightTheme = {
  isDark: false, bg: '#F8F9FE', primary: '#6772E5', textDark: '#1A1D28', textLight: '#8A8D9F',
  white: '#FFFFFF', surface: '#FFFFFF', inputBg: '#F3F4F8', cardBg1: '#EAF0FF', cardBg2: '#F2EAFB'
};

const darkTheme = {
  isDark: true, bg: '#13151F', primary: '#6772E5', textDark: '#F4F5F9', textLight: '#94A3B8',
  white: '#FFFFFF', surface: '#1E212E', inputBg: '#0C0E15', cardBg1: '#1F2740', cardBg2: '#2A1F3D'
};

// --- SHARED HEADER ---
const SharedHeader = ({ title, navigation, showBack = false, theme }: any) => (
  <View style={[styles.topHeader, { backgroundColor: theme.bg }]}>
    {showBack ? (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
        <ChevronLeft color={theme.textDark} size={28} />
      </TouchableOpacity>
    ) : <View style={styles.iconBtn} />}
    <Text style={[styles.headerTitle, { color: theme.textDark }]}>{title}</Text>
    <View style={styles.iconBtn} />
  </View>
);

// --- ADMIN DASHBOARD SCREEN ---
const AdminDashboardScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const menus = [
    { t: "Attendance", r: "FacultyAttendanceApproval", i: <ClipboardCheck color="#5969E6" size={24}/>, bg: theme.cardBg1 },
    { t: "Department Entry", r: "DepartmentEntry", i: <BookOpen color="#8E73D4" size={24}/>, bg: theme.cardBg2 },
    { t: "Subject Entry", r: "SubjectEntry", i: <BookPlus color="#8E73D4" size={24}/>, bg: theme.cardBg2 }, 
    { t: "Faculty Entry", r: "FacultyEntry", i: <UserPlus color="#5969E6" size={24}/>, bg: theme.cardBg1 },
    { t: "Student Entry", r: "StudentEntry", i: <User color="#8E73D4" size={24}/>, bg: theme.cardBg2 },
    { t: "Allocation", r: "SubjectAllocation", i: <Link color="#5969E6" size={24}/>, bg: theme.cardBg1 },
    { t: "Manual Timetable", r: "TimetableManual", i: <Calendar color="#8E73D4" size={24}/>, bg: theme.cardBg2 },
  ];
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg}]}>
      <SharedHeader title="Admin Dashboard" navigation={navigation} theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Management Controls</Text>
        <View style={styles.dashboardGrid}>
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

// --- FACULTY ATTENDANCE / LEAVE APPROVAL SCREEN ---
const FacultyAttendanceApprovalScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payStatus, setPayStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = firestore()
      .collection('faculty_leaves')
      .where('status', '==', 'Pending')
      .onSnapshot(snap => {
        const data = snap ? snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : [];
        setLeaves(data);
        setLoading(false);
      });
    return () => unsub();
  }, []);

  const handleProcessLeave = async (id: string, decision: 'Approved' | 'Denied') => {
    const isPaid = payStatus[id] || false;
    try {
      await firestore().collection('faculty_leaves').doc(id).update({
        status: decision,
        isPaidLeave: decision === 'Approved' ? isPaid : false,
        processedAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", `Leave request ${decision.toLowerCase()}.`);
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <SharedHeader title="Faculty Attendance" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: theme.textDark }]}>Leave Approvals</Text>
        {loading ? <ActivityIndicator color={theme.primary} /> : leaves.length === 0 ? (
          <Text style={{ color: theme.textLight, textAlign: 'center', marginTop: 20 }}>No pending leave requests.</Text>
        ) : leaves.map((l) => (
          <View key={l.id} style={[styles.manualCard, { backgroundColor: theme.surface }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.textDark, fontWeight: 'bold', fontSize: 16 }}>
                {l.name || l.employeeId}
              </Text>
              <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                {l.time || 'Duration N/A'}
              </Text>
            </View>
            
            <Text style={{ color: theme.textLight, marginTop: 5 }}>Dates: {l.from} to {l.to}</Text>
            
            <View style={{ backgroundColor: theme.inputBg, padding: 10, borderRadius: 8, marginTop: 10 }}>
              <Text style={{ color: theme.textDark }}>Reason: {l.reason}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Banknote color={payStatus[l.id] ? "#4CAF50" : theme.textLight} size={20} />
                <Text style={{ color: theme.textDark, marginLeft: 5 }}>Paid Leave?</Text>
              </View>
              <Switch 
                value={payStatus[l.id] || false} 
                onValueChange={() => setPayStatus({ ...payStatus, [l.id]: !payStatus[l.id] })} 
                trackColor={{ true: theme.primary }} 
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <TouchableOpacity 
                onPress={() => handleProcessLeave(l.id, 'Approved')} 
                style={{ backgroundColor: '#4CAF50', flex: 0.48, padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <CheckCircle2 color="#FFF" size={18} />
                <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 5 }}>Approve</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleProcessLeave(l.id, 'Denied')} 
                style={{ backgroundColor: '#FF6B6B', flex: 0.48, padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <XCircle color="#FFF" size={18} />
                <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 5 }}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const TimetableManualScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  
  // --- TOP NAVIGATION TABS ---
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'view'>('create');

  // --- GLOBAL FILTERS ---
  const [selectedSem, setSelectedSem] = useState<string>('Sem 1');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // --- ROWS STATE ---
  const [rows, setRows] = useState([{ id: Date.now().toString(), day: '', sub: '', subCode: '', startTime: '', endTime: '', room: '', showSubDrop: false }]); // CREATE
  const [editRows, setEditRows] = useState<any[]>([]); // EDIT & VIEW

  // 1. FETCH DEPARTMENTS
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const snap = await firestore().collection('departments').get();
        const depts = snap.docs.map(doc => doc.data().code).filter(Boolean);
        setDepartments(depts.length > 0 ? depts : ['BCA', 'BBA', 'B.Tech', 'MCA']);
      } catch (e) {
        setDepartments(['BCA', 'BBA', 'B.Tech']);
      }
    };
    fetchDepartments();
  }, []);

  // 2. FETCH SUBJECTS
  useEffect(() => {
    if (selectedDept) {
      const fetchSubjects = async () => {
        try {
          const snap = await firestore().collection('subjects')
            .where('department', '==', selectedDept)
            .get();
          
          const subs = snap.docs
            .map(doc => doc.data())
            .filter(data => data.semester === selectedSem)
            .map(data => data.name)
            .filter(Boolean);
            
          setSubjects(subs);
        } catch (e) {
          console.log("Error fetching subjects: ", e);
        }
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedDept, selectedSem]);

  // 3. FETCH EXISTING TIMETABLE (For Edit & View)
  useEffect(() => {
    if ((activeTab === 'edit' || activeTab === 'view') && selectedDept && selectedSem) {
      const fetchExistingTimetable = async () => {
        try {
          const snap = await firestore().collection('lectures')
            .where('department', '==', selectedDept)
            .where('semester', '==', selectedSem)
            .get();
          
          const fetchedData = snap.docs.map(doc => ({
            id: doc.id,
            day: doc.data().day || '',
            sub: doc.data().subject || '',
            startTime: doc.data().startTime || '',
            endTime: doc.data().endTime || '',
            room: doc.data().room || '',
            showSubDrop: false
          }));
          setEditRows(fetchedData);
        } catch (e) {
          console.log("Fetch Error:", e);
        }
      };
      fetchExistingTimetable();
    }
  }, [activeTab, selectedDept, selectedSem]);

  // --- CREATE LOGIC ---
  const updateRow = (index: number, field: string, value: any) => {
    const newRows: any = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const submitNewTimetable = async () => {
    if (!selectedDept) return Alert.alert("Error", "Please select a Department at the top.");
    setLoading(true);
    try {
      const batch = firestore().batch();
      rows.forEach(row => {
        if (row.sub && row.subCode && row.day && row.startTime && row.endTime) {
          const docRef = firestore().collection('lectures').doc();
          batch.set(docRef, {
            department: selectedDept,
            semester: selectedSem,
            subject: row.sub, 
            subCode: row.subCode.trim().toUpperCase(), 
            day: row.day, 
            time: `${row.startTime} - ${row.endTime}`, 
            startTime: row.startTime,
            endTime: row.endTime,
            room: row.room,
            createdAt: firestore.FieldValue.serverTimestamp()
          });
        }
      });
      await batch.commit();
      Alert.alert("Success", "Timetable Created Successfully!");
      setRows([{ id: Date.now().toString(), day: '', sub: '', subCode: '', startTime: '', endTime: '', room: '', showSubDrop: false }]);
    } catch (e: any) { Alert.alert("Error", e.message); }
    setLoading(false);
  };

  // --- EDIT LOGIC ---
  const updateEditRow = (index: number, field: string, value: any) => {
    const newRows: any = [...editRows];
    newRows[index][field] = value;
    setEditRows(newRows);
  };

  const deleteExistingSlot = (id: string) => {
    Alert.alert("Delete Slot", "Permanently delete this lecture?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await firestore().collection('lectures').doc(id).delete();
            setEditRows(editRows.filter(r => r.id !== id));
            Alert.alert("Deleted", "Slot removed successfully.");
          } catch(e: any) { Alert.alert("Error", e.message); }
      }}
    ]);
  };

  const updateExistingTimetable = async () => {
    if (editRows.length === 0) return Alert.alert("Info", "No data to update.");
    setLoading(true);
    try {
      const batch = firestore().batch();
      editRows.forEach(row => {
        if (row.id) {
          const docRef = firestore().collection('lectures').doc(row.id);
          batch.update(docRef, {
            subject: row.sub, 
            day: row.day, 
            time: `${row.startTime} - ${row.endTime}`, 
            startTime: row.startTime,
            endTime: row.endTime,
            room: row.room
          });
        }
      });
      await batch.commit();
      Alert.alert("Success", "Timetable Updated Successfully!");
    } catch (e: any) { Alert.alert("Error", e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg || theme.background}]}>
      <SharedHeader title="Manage Timetable" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled={true}>
        
        {/* --- 3 BUTTONS FOR NAVIGATION --- */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 10}}>
          <TouchableOpacity style={[styles.tabBtn, {backgroundColor: activeTab === 'create' ? theme.primary : theme.cardBg1}]} onPress={() => setActiveTab('create')}>
            <Text style={{color: activeTab === 'create' ? '#FFF' : theme.primary, fontWeight: 'bold', fontSize: 13}}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, {backgroundColor: activeTab === 'edit' ? theme.primary : theme.cardBg1}]} onPress={() => setActiveTab('edit')}>
            <Text style={{color: activeTab === 'edit' ? '#FFF' : theme.primary, fontWeight: 'bold', fontSize: 13}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, {backgroundColor: activeTab === 'view' ? theme.primary : theme.cardBg1}]} onPress={() => setActiveTab('view')}>
            <Text style={{color: activeTab === 'view' ? '#FFF' : theme.primary, fontWeight: 'bold', fontSize: 13}}>View</Text>
          </TouchableOpacity>
        </View>

        {/* --- SHARED FILTERS --- */}
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>1. Select Semester</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
            <TouchableOpacity key={sem} onPress={() => setSelectedSem(sem)} style={[styles.dayButton, {backgroundColor: selectedSem === sem ? theme.primary : theme.cardBg1}]}>
              <Text style={{color: selectedSem === sem ? '#FFF' : theme.textLight, fontWeight: 'bold'}}>{sem}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>2. Select Department</Text>
        <TouchableOpacity style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={() => setShowDeptDrop(!showDeptDrop)}>
          <Text style={{color: selectedDept ? theme.textDark : theme.textLight}}>{selectedDept || "Choose Department..."}</Text>
          {showDeptDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
        </TouchableOpacity>

        {showDeptDrop && (
          <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
            {departments.length === 0 ? <Text style={{color: theme.textLight}}>No departments found.</Text> : null}
            {departments.map((dept) => (
              <TouchableOpacity key={dept} style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}} onPress={() => { setSelectedDept(dept); setShowDeptDrop(false); }}>
                <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{dept}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* --- CREATE TIMETABLE TAB CONTENT --- */}
        {activeTab === 'create' && selectedDept && (
          <View style={{marginTop: 10}}>
            <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Schedule Builder</Text>
            {rows.map((row, index) => (
              <View key={row.id} style={[styles.manualCard, {backgroundColor: theme.surface}]}>
                <Text style={[styles.inputLabel, {color: theme.textDark}]}>Day</Text>
                <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder="e.g. Monday" placeholderTextColor={theme.textLight} value={row.day} onChangeText={(t) => updateRow(index, 'day', t)} />

                <Text style={[styles.inputLabel, {color: theme.textDark}]}>Subject Name</Text>
                <TouchableOpacity style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={() => updateRow(index, 'showSubDrop', !row.showSubDrop)}>
                  <Text style={{color: row.sub ? theme.textDark : theme.textLight}}>{row.sub || "Select Subject..."}</Text>
                  {row.showSubDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
                </TouchableOpacity>

                {row.showSubDrop && (
                  <View style={{backgroundColor: theme.background, borderRadius: 12, marginBottom: 15, padding: 10}}>
                    {subjects.length === 0 ? <Text style={{color: theme.textLight}}>No subjects found.</Text> : null}
                    {subjects.map((sub, idx) => (
                      <TouchableOpacity key={idx} style={{paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.inputBg}} onPress={() => { updateRow(index, 'sub', sub); updateRow(index, 'showSubDrop', false); }}>
                        <Text style={{color: theme.textDark}}>{sub}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={[styles.inputLabel, {color: theme.textDark}]}>Subject Code</Text>
                <TextInput 
                  style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
                  placeholder="e.g. CE2023" 
                  placeholderTextColor={theme.textLight} 
                  value={row.subCode} 
                  onChangeText={(t) => updateRow(index, 'subCode', t)} 
                  autoCapitalize="characters"
                />

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{width: '48%'}}>
                    <Text style={[styles.inputLabel, {color: theme.textDark}]}>Start Time</Text>
                    <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder="10:00 AM" placeholderTextColor={theme.textLight} value={row.startTime} onChangeText={(t) => updateRow(index, 'startTime', t)} />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={[styles.inputLabel, {color: theme.textDark}]}>End Time</Text>
                    <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder="11:30 AM" placeholderTextColor={theme.textLight} value={row.endTime} onChangeText={(t) => updateRow(index, 'endTime', t)} />
                  </View>
                </View>

                <Text style={[styles.inputLabel, {color: theme.textDark}]}>Room No.</Text>
                <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder="Lab 2" placeholderTextColor={theme.textLight} value={row.room} onChangeText={(t) => updateRow(index, 'room', t)} />
              </View>
            ))}

            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.cardBg1}]} onPress={() => setRows([...rows, {id: Date.now().toString(), day: '', sub: '', subCode: '', startTime: '', endTime: '', room: '', showSubDrop: false}])}>
              <Text style={{color: theme.primary, fontWeight: 'bold'}}>+ Add Another Slot</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary, marginTop: 15, marginBottom: 40}]} onPress={submitNewTimetable} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={{color: '#FFF', fontWeight: 'bold'}}>Save Timetable</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* --- EDIT TIMETABLE TAB CONTENT --- */}
        {activeTab === 'edit' && selectedDept && (
          <View style={{marginTop: 10}}>
            <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Edit Slots</Text>
            {editRows.length === 0 ? (
              <Text style={{color: theme.textLight, textAlign: 'center', marginTop: 20}}>No existing timetable found.</Text>
            ) : (
              <>
                {editRows.map((row, index) => (
                  <View key={row.id} style={[styles.manualCard, {backgroundColor: theme.surface, borderColor: theme.primary, borderWidth: 1}]}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                      <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 16}}>Edit Slot</Text>
                      <TouchableOpacity onPress={() => deleteExistingSlot(row.id)} style={{backgroundColor: '#FF6B6B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8}}>
                        <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 12}}>Remove</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.inputLabel, {color: theme.textDark}]}>Day</Text>
                    <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} value={row.day} onChangeText={(t) => updateEditRow(index, 'day', t)} />

                    <Text style={[styles.inputLabel, {color: theme.textDark}]}>Subject</Text>
                    <TouchableOpacity style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={() => updateEditRow(index, 'showSubDrop', !row.showSubDrop)}>
                      <Text style={{color: row.sub ? theme.textDark : theme.textLight}}>{row.sub || "Select Subject..."}</Text>
                      {row.showSubDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
                    </TouchableOpacity>

                    {row.showSubDrop && (
                      <View style={{backgroundColor: theme.background, borderRadius: 12, marginBottom: 15, padding: 10}}>
                        {subjects.map((sub, idx) => (
                          <TouchableOpacity key={idx} style={{paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.inputBg}} onPress={() => { updateEditRow(index, 'sub', sub); updateEditRow(index, 'showSubDrop', false); }}>
                            <Text style={{color: theme.textDark}}>{sub}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View style={{width: '48%'}}><Text style={[styles.inputLabel, {color: theme.textDark}]}>Start Time</Text><TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} value={row.startTime} onChangeText={(t) => updateEditRow(index, 'startTime', t)} /></View>
                      <View style={{width: '48%'}}><Text style={[styles.inputLabel, {color: theme.textDark}]}>End Time</Text><TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} value={row.endTime} onChangeText={(t) => updateEditRow(index, 'endTime', t)} /></View>
                    </View>

                    <Text style={[styles.inputLabel, {color: theme.textDark}]}>Room No.</Text>
                    <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} value={row.room} onChangeText={(t) => updateEditRow(index, 'room', t)} />
                  </View>
                ))}
                <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary, marginTop: 15, marginBottom: 40}]} onPress={updateExistingTimetable} disabled={loading}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={{color: '#FFF', fontWeight: 'bold'}}>Update All Changes</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* --- VIEW TIMETABLE TAB CONTENT --- */}
        {activeTab === 'view' && selectedDept && (
          <View style={{marginTop: 10, marginBottom: 40}}>
            <Text style={[styles.sectionTitle, {color: theme.textDark}]}>Overview</Text>
            {editRows.length === 0 ? (
              <Text style={{color: theme.textLight, textAlign: 'center', marginTop: 20}}>No timetable to display.</Text>
            ) : (
              editRows.map((row) => (
                <View key={row.id} style={[styles.manualCard, {backgroundColor: theme.surface, borderLeftWidth: 4, borderLeftColor: theme.primary}]}>
                  <Text style={{color: theme.textDark, fontWeight: 'bold', fontSize: 18}}>{row.sub}</Text>
                  <Text style={{color: theme.primary, fontWeight: 'bold', marginTop: 5}}>{row.day} | {row.startTime} - {row.endTime}</Text>
                  <Text style={{color: theme.textLight, marginTop: 5}}>Room: {row.room}</Text>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

// --- NAYA: MANAGE STUDENT MODAL COMPONENT ---
const ManageStudentModal = ({ visible, onClose, theme }: any) => {
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATES ---
  const [departments, setDepartments] = useState<string[]>(['All']);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSem, setSelectedSem] = useState<string>('All');
  const [showDeptDrop, setShowDeptDrop] = useState(false);

  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // 1. Fetch Departments for Dropdown
          const deptSnap = await firestore().collection('departments').get();
          const depts = deptSnap.docs.map(doc => doc.data().code).filter(Boolean);
          setDepartments(['All', ...(depts.length ? depts : ['BCA', 'BBA', 'IT', 'CE'])]);

          // 2. Fetch Students
          const snap = await firestore().collection('students').get();
          const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setStudentsList(data);
        } catch (error) {
          console.log("Error fetching data: ", error);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [visible]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to permanently remove ${name}? They will lose app access.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('students').doc(id).delete();
              await firestore().collection('users').doc(id).delete();
              setStudentsList(prev => prev.filter(s => s.id !== id));
              Alert.alert("Deleted", "Student removed successfully.");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          }
        }
      ]
    );
  };

  // --- SMART FILTERING LOGIC ---
  const filteredStudents = studentsList.filter(std => {
    let matchDept = true;
    let matchSem = true;

    if (selectedDept !== 'All') {
      matchDept = std.department?.trim().toLowerCase() === selectedDept.toLowerCase();
    }
    if (selectedSem !== 'All') {
      matchSem = std.semester === selectedSem;
    }

    return matchDept && matchSem;
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: theme.bg || theme.background, height: '90%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ color: theme.textDark, fontSize: 20, fontWeight: 'bold' }}>Manage Students</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5, backgroundColor: theme.inputBg, borderRadius: 20 }}>
              <X color={theme.textDark} size={24} />
            </TouchableOpacity>
          </View>

          {/* --- SEMESTER FILTER --- */}
          <Text style={{ color: theme.textDark, fontWeight: 'bold', marginBottom: 8 }}>Filter by Semester</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15, maxHeight: 40 }}>
            {['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
              <TouchableOpacity 
                key={sem} 
                onPress={() => setSelectedSem(sem)} 
                style={{
                  backgroundColor: selectedSem === sem ? theme.primary : theme.inputBg,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginRight: 10,
                  justifyContent: 'center'
                }}
              >
                <Text style={{color: selectedSem === sem ? '#FFF' : theme.textLight, fontWeight: 'bold', fontSize: 13}}>
                  {sem}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* --- DEPARTMENT FILTER --- */}
          <Text style={{ color: theme.textDark, fontWeight: 'bold', marginBottom: 8 }}>Filter by Department</Text>
          <TouchableOpacity 
            style={{backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 15}}
            onPress={() => setShowDeptDrop(!showDeptDrop)}
          >
            <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{selectedDept}</Text>
            {showDeptDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
          </TouchableOpacity>

          {showDeptDrop && (
            <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, borderWidth: 1, borderColor: theme.border || '#EAECEF'}}>
              {departments.map((dept) => (
                <TouchableOpacity 
                  key={dept} 
                  style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}}
                  onPress={() => {
                    setSelectedDept(dept);
                    setShowDeptDrop(false);
                  }}
                >
                  <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{dept}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* --- STUDENT LIST --- */}
          {loading ? (
            <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 30 }} />
          ) : filteredStudents.length === 0 ? (
            <Text style={{ color: theme.textLight, textAlign: 'center', marginTop: 30 }}>No students found for this filter.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {filteredStudents.map((std) => (
                <View 
                  key={std.id} 
                  style={{ backgroundColor: theme.surface, padding: 15, borderRadius: 15, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: theme.border || '#EAECEF' }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                      <User color="#FFF" size={20} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.textDark, fontSize: 16, fontWeight: 'bold' }}>{std.name}</Text>
                      <Text style={{ color: theme.textLight, fontSize: 13, marginTop: 2 }}>{std.department || 'N/A'} | {std.semester || 'N/A'} | {std.studentId || std.id}</Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => handleDelete(std.id, std.name)} style={{ backgroundColor: '#FFE5E5', padding: 10, borderRadius: 10 }}>
                    <Trash2 color="#FF6B6B" size={20} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

// --- FACULTY ENTRY SCREEN ---
// --- MANAGE (PROMOTE) FACULTY MODAL COMPONENT ---
// --- MANAGE (PROMOTE & REMOVE) FACULTY MODAL COMPONENT ---
const ManageFacultyModal = ({ visible, onClose, theme }: any) => {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- EDIT & PROMOTION STATES ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesig, setEditDesig] = useState('Assistant Professor');
  const [showDesigDrop, setShowDesigDrop] = useState(false);
  const [updating, setUpdating] = useState(false);

  const designations = [
    'Assistant Professor', 
    'Senior Professor', 
    'HOD (Department)', 
    'HOD (College)'
  ];

  // Fetch Faculties
  useEffect(() => {
    if (visible) {
      const fetchFaculties = async () => {
        setLoading(true);
        try {
          const snap = await firestore().collection('faculty').get();
          const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFaculties(data);
        } catch (error) {
          console.log("Error fetching faculties: ", error);
        }
        setLoading(false);
      };
      fetchFaculties();
    }
  }, [visible]);

  // --- DELETE LOGIC ---
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Remove Faculty",
      `Are you sure you want to permanently remove ${name}? They will lose app access.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Remove from 'faculty' collection
              await firestore().collection('faculty').doc(id).delete();
              // 2. Remove from 'users' collection (Revokes login access)
              await firestore().collection('users').doc(id).delete();
              
              // 3. Update UI list
              setFaculties(prev => prev.filter(f => f.id !== id));
              Alert.alert("Deleted", "Faculty removed successfully.");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          }
        }
      ]
    );
  };

  // --- UPDATE PROMOTION LOGIC ---
  const handleUpdate = async (id: string) => {
    setUpdating(true);
    try {
      await firestore().collection('faculty').doc(id).update({
        designation: editDesig
      });
      // Local state update taaki bina refresh kiye UI update ho jaye
      setFaculties(prev => prev.map(f => f.id === id ? { ...f, designation: editDesig } : f));
      setEditingId(null);
      Alert.alert("Promoted!", "Faculty designation updated successfully.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setUpdating(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: theme.bg || theme.background, height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: theme.textDark, fontSize: 20, fontWeight: 'bold' }}>Manage Faculty</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5, backgroundColor: theme.inputBg, borderRadius: 20 }}>
              <X color={theme.textDark} size={24} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 50 }} />
          ) : faculties.length === 0 ? (
            <Text style={{ color: theme.textLight, textAlign: 'center', marginTop: 50 }}>No faculty members found.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {faculties.map((fac) => (
                <View 
                  key={fac.id} 
                  style={{ backgroundColor: theme.surface, padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: editingId === fac.id ? theme.primary : (theme.border || '#EAECEF') }}
                >
                  
                  {/* --- EDIT MODE UI --- */}
                  {editingId === fac.id ? (
                    <View style={{ width: '100%' }}>
                      <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16, marginBottom: 15 }}>Promote / Edit Role</Text>
                      
                      <Text style={[styles.inputLabel, {color: theme.textDark, marginTop: 0}]}>Designation</Text>
                      <TouchableOpacity 
                        style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}
                        onPress={() => setShowDesigDrop(!showDesigDrop)}
                      >
                        <Text style={{color: theme.textDark, fontWeight: '500'}}>{editDesig}</Text>
                        {showDesigDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
                      </TouchableOpacity>

                      {showDesigDrop && (
                        <View style={{backgroundColor: theme.bg || theme.background, borderRadius: 12, marginBottom: 15, padding: 5, borderWidth: 1, borderColor: theme.inputBg}}>
                          {designations.map((desig) => (
                            <TouchableOpacity 
                              key={desig} 
                              style={{paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: theme.inputBg}}
                              onPress={() => { setEditDesig(desig); setShowDesigDrop(false); }}
                            >
                              <Text style={{color: theme.textDark, fontWeight: desig === editDesig ? 'bold' : 'normal'}}>{desig}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <TouchableOpacity 
                          onPress={() => handleUpdate(fac.id)}
                          style={{ backgroundColor: theme.primary, flex: 0.48, padding: 14, borderRadius: 12, alignItems: 'center' }}
                          disabled={updating}
                        >
                          {updating ? <ActivityIndicator color="#FFF" /> : <Text style={{color: '#FFF', fontWeight: 'bold'}}>Save</Text>}
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          onPress={() => { setEditingId(null); setShowDesigDrop(false); }}
                          style={{ backgroundColor: theme.cardBg1, flex: 0.48, padding: 14, borderRadius: 12, alignItems: 'center' }}
                        >
                          <Text style={{color: theme.primary, fontWeight: 'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    /* --- NORMAL LIST VIEW (PROMOTE & REMOVE BUTTONS) --- */
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                          <User color="#FFF" size={20} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: theme.textDark, fontSize: 16, fontWeight: 'bold' }}>{fac.name}</Text>
                          <Text style={{ color: theme.textLight, fontSize: 13, marginTop: 2 }}>{fac.department || 'No Dept'} | {fac.designation || 'Assistant Professor'}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        {/* Edit (Promote) Button */}
                        <TouchableOpacity 
                          onPress={() => { 
                            setEditingId(fac.id); 
                            setEditDesig(fac.designation || 'Assistant Professor'); 
                            setShowDesigDrop(false);
                          }}
                          style={{ backgroundColor: theme.cardBg1, padding: 10, borderRadius: 10, marginRight: 8 }}
                        >
                          <Edit2 color={theme.primary} size={20} />
                        </TouchableOpacity>

                        {/* Delete (Remove) Button */}
                        <TouchableOpacity 
                          onPress={() => handleDelete(fac.id, fac.name)}
                          style={{ backgroundColor: '#FFE5E5', padding: 10, borderRadius: 10 }}
                        >
                          <Trash2 color="#FF6B6B" size={20} />
                        </TouchableOpacity>
                      </View>

                    </View>
                  )}

                </View>
              ))}
            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
};
// --- FACULTY ENTRY SCREEN ---
const FacultyEntryScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false); 

  const fields = [
    { l: "Full Name", k: "name" }, { l: "Faculty ID (Username)", k: "facultyId" },
    { l: "DOB", k: "dob" }, { l: "Contact Number", k: "contact" },
    { l: "Email ID", k: "email" }, { l: "Department", k: "department" }
  ];

  const handleSave = async () => {
    if (!formData.facultyId || !formData.name) return Alert.alert("Error", "ID and Name are required.");
    setLoading(true);
    try {
      const id = formData.facultyId.trim();
      
      // Save data in faculty collection with a default Designation
      await firestore().collection('faculty').doc(id).set({ 
        ...formData, 
        employeeId: id,
        designation: 'Assistant Professor' // Nayi faculty hamesha Assistant Professor banegi automatically
      });
      
      await firestore().collection('users').doc(id).set({
        name: formData.name, role: 'faculty', password: `${id}@123`
      });
      
      Alert.alert("Success", `Faculty Saved! Login ID: ${id}\nPassword: ${id}@123`);
      setFormData({});
    } catch (e: any) { Alert.alert("Error", e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg}]}>
      <SharedHeader title="Faculty Entry" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {fields.map((f, i) => (
          <View key={i}>
            <Text style={[styles.inputLabel, {color: theme.textDark}]}>{f.l}</Text>
            <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder={`Enter ${f.l}`} placeholderTextColor={theme.textLight} value={formData[f.k] || ''} onChangeText={t => setFormData({...formData, [f.k]: t})}/>
          </View>
        ))}
        
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary}]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Save & Create Login</Text>}
        </TouchableOpacity>

        {/* PROMOTE FACULTY BUTTON (Text updated to reflect its true purpose) */}
        <TouchableOpacity 
          style={[styles.actionBtn, {backgroundColor: theme.cardBg1, marginTop: 15, borderColor: theme.primary, borderWidth: 1}]} 
          onPress={() => setShowManageModal(true)}
        >
          <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 16}}>Promote Faculty</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL COMPONENT INJECTED HERE */}
      <ManageFacultyModal 
        visible={showManageModal} 
        onClose={() => setShowManageModal(false)} 
        theme={theme} 
      />
    </SafeAreaView>
  );
};
// --- DEPARTMENT ENTRY SCREEN ---
const DepartmentEntryScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    if (!deptName || !deptCode) {
      return Alert.alert("Error", "Please enter both Department Name and Code.");
    }
    
    setLoading(true);
    try {
      const deptData = {
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        createdAt: firestore.FieldValue.serverTimestamp()
      };
      
      await firestore().collection('departments').doc(deptData.code).set(deptData);
      
      Alert.alert("Success", "Department Added Successfully!");
      setDeptName('');
      setDeptCode('');
    } catch (e: any) { 
      Alert.alert("Error", e.message); 
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg || theme.background}]}>
      <SharedHeader title="Department Entry" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>Department Name</Text>
        <TextInput 
          style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
          placeholder="e.g. Computer Applications" 
          placeholderTextColor={theme.textLight} 
          value={deptName} 
          onChangeText={setDeptName}
        />

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>Department Code (Short Form)</Text>
        <TextInput 
          style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
          placeholder="e.g. BCA or MCA" 
          placeholderTextColor={theme.textLight} 
          value={deptCode} 
          onChangeText={setDeptCode}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary, marginTop: 20}]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Save Department</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- STUDENT ENTRY SCREEN ---
const StudentEntryScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const [formData, setFormData] = useState<any>({ semester: 'Sem 1' });
  const [loading, setLoading] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const fields = [
    { l: "Full Name", k: "name" }, 
    { l: "Enrollment Number", k: "enrollment" },
    { l: "DOB", k: "dob" }, 
    { l: "Contact Number", k: "contact" },
    { l: "Course/Department", k: "department" },
    { l: "Admission Year", k: "year" }
  ];

  // --- NAYA: CAMERA AUR GALLERY SELECTION LOGIC ---
  const handleImageSourceSelection = () => {
    Alert.alert(
      "Select Student Photo",
      "Choose an option to upload the profile picture",
      [
        {
          text: "Take Photo (Camera)",
          onPress: () => openCamera(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.3, includeBase64: true }, (response) => {
      handleResponse(response);
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.3, includeBase64: true }, (response) => {
      handleResponse(response);
    });
  };

  const handleResponse = (response: any) => {
    if (response.didCancel || response.errorMessage) return;
    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      const base64Image = `data:${asset.type};base64,${asset.base64}`;
      setFormData({ ...formData, photoUrl: base64Image });
    }
  };

  const handleSave = async () => {
    if (!formData.enrollment || !formData.name || !formData.department) {
      return Alert.alert("Error", "Name, Enrollment, and Department are required.");
    }
    setLoading(true);
    try {
      const id = formData.enrollment.trim();
      await firestore().collection('students').doc(id).set({ ...formData, studentId: id });
      await firestore().collection('users').doc(id).set({
        name: formData.name, role: 'student', password: `${id}@123`
      });
      Alert.alert("Success", `Student Saved!\nLogin ID: ${id}\nPassword: ${id}@123`);
      setFormData({ semester: 'Sem 1' });
    } catch (e: any) { Alert.alert("Error", e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg || theme.background}]}>
      <SharedHeader title="Student Entry" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* PROFILE PHOTO UI - Now opens selection menu */}
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <TouchableOpacity 
            onPress={handleImageSourceSelection}
            style={{
              width: 110, height: 110, borderRadius: 55, backgroundColor: theme.inputBg,
              justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.primary,
              overflow: 'hidden', elevation: 2
            }}
          >
            {formData.photoUrl ? (
              <Image source={{ uri: formData.photoUrl }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <User color={theme.textLight} size={35} />
                <Text style={{ color: theme.textLight, fontSize: 12, marginTop: 5, fontWeight: 'bold' }}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ... (Baki ka fields aur buttons wala code same rahega) */}
        
        <View style={{ marginBottom: 15 }}>
          <Text style={[styles.inputLabel, {color: theme.textDark}]}>Select Semester</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.daySelector, {marginTop: 5}]}>
            {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map(sem => (
              <TouchableOpacity 
                key={sem} 
                onPress={() => setFormData({...formData, semester: sem})} 
                style={[styles.dayButton, {backgroundColor: formData.semester === sem ? theme.primary : theme.cardBg1}]}
              >
                <Text style={{color: formData.semester === sem ? '#FFF' : theme.textLight, fontWeight: 'bold'}}>{sem}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {fields.map((f, i) => (
          <View key={i}>
            <Text style={[styles.inputLabel, {color: theme.textDark}]}>{f.l}</Text>
            <TextInput 
              style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
              placeholder={`Enter ${f.l}`} 
              placeholderTextColor={theme.textLight} 
              value={formData[f.k] || ''} 
              onChangeText={t => setFormData({...formData, [f.k]: t})}
              autoCapitalize={f.k === 'department' ? 'characters' : 'words'}
            />
          </View>
        ))}

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary, marginTop: 20}]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Save & Create Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.cardBg1, marginTop: 15, borderColor: theme.primary, borderWidth: 1}]} onPress={() => setShowManageModal(true)}>
          <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 16}}>View / Remove Student</Text>
        </TouchableOpacity>

      </ScrollView>

      <ManageStudentModal visible={showManageModal} onClose={() => setShowManageModal(false)} theme={theme} />
    </SafeAreaView>
  );
};

// --- SUBJECT ENTRY SCREEN ---
const SubjectEntryScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedSem, setSelectedSem] = useState<string>('Sem 1');
  
  const [loading, setLoading] = useState(false);
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const snap = await firestore().collection('departments').get();
        const depts = snap.docs.map(doc => doc.data().code).filter(Boolean);
        
        if (depts.length === 0) {
          setDepartments(['BCA', 'BBA', 'B.Tech']);
        } else {
          setDepartments(depts);
        }
      } catch (e) {
        console.log("Error fetching departments: ", e);
      }
    };
    fetchDepartments();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.code || !selectedDept) {
      return Alert.alert("Error", "Please fill all fields and select a department.");
    }
    
    setLoading(true);
    try {
      const subjectData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(), 
        department: selectedDept,
        semester: selectedSem,
        createdAt: firestore.FieldValue.serverTimestamp()
      };
      
      await firestore().collection('subjects').doc(subjectData.code).set(subjectData);
      
      Alert.alert("Success", "Subject Added Successfully!");
      
      setFormData({ name: '', code: '' });
      setSelectedDept(null);
      setSelectedSem('Sem 1');
    } catch (e: any) { 
      Alert.alert("Error", e.message); 
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg || theme.background}]}>
      <SharedHeader title="Subject Entry" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled={true}>
        
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>1. Select Department</Text>
        <TouchableOpacity 
          style={[styles.inputField, {backgroundColor: theme.inputBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}
          onPress={() => setShowDeptDrop(!showDeptDrop)}
        >
          <Text style={{color: selectedDept ? theme.textDark : theme.textLight}}>
            {selectedDept || "Select Department..."}
          </Text>
          {showDeptDrop ? <ChevronUp color={theme.textLight} size={20} /> : <ChevronDown color={theme.textLight} size={20} />}
        </TouchableOpacity>

        {showDeptDrop && (
          <View style={{backgroundColor: theme.surface, borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2}}>
            {departments.map((dept) => (
              <TouchableOpacity 
                key={dept} 
                style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBg}}
                onPress={() => {
                  setSelectedDept(dept);
                  setShowDeptDrop(false);
                }}
              >
                <Text style={{color: theme.textDark, fontWeight: 'bold'}}>{dept}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>2. Subject Name</Text>
        <TextInput 
          style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
          placeholder="e.g. Data Structures" 
          placeholderTextColor={theme.textLight} 
          value={formData.name} 
          onChangeText={t => setFormData({...formData, name: t})}
        />

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>3. Subject Code</Text>
        <TextInput 
          style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} 
          placeholder="e.g. CS301" 
          placeholderTextColor={theme.textLight} 
          value={formData.code} 
          onChangeText={t => setFormData({...formData, code: t})}
          autoCapitalize="characters"
        />

        <Text style={[styles.inputLabel, {color: theme.textDark}]}>4. Select Semester</Text>
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

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary, marginTop: 20}]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Save Subject</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};


// --- SUBJECT ALLOCATION SCREEN ---
const SubjectAllocationScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const [formData, setFormData] = useState({ course: '', sem: '', subCode: '', facultyId: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await firestore().collection('allocations').add(formData);
      Alert.alert("Success", "Subject Allocated to Faculty");
      setFormData({ course: '', sem: '', subCode: '', facultyId: '' });
    } catch (e: any) { Alert.alert("Error", e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg}]}>
      <SharedHeader title="Subject Allocation" navigation={navigation} showBack theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {['course', 'sem', 'subCode', 'facultyId'].map((key, i) => (
          <View key={i}>
            <Text style={[styles.inputLabel, {color: theme.textDark, textTransform: 'capitalize'}]}>{key}</Text>
            <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder={`Enter ${key}`} placeholderTextColor={theme.textLight} value={(formData as any)[key]} onChangeText={t => setFormData({...formData, [key]: t})}/>
          </View>
        ))}
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary}]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Allocate Subject</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- MARK FACULTY SCREEN (Now acts as historical attendance) ---
const MarkFacultyScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const [facId, setFacId] = useState('');
  const [status, setStatus] = useState('Present');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!facId) return;
    setLoading(true);
    try {
      await firestore().collection('faculty_attendance').add({
        facultyId: facId, status: status, date: new Date().toISOString()
      });
      Alert.alert("Success", `Marked ${status} for ${facId}`);
      setFacId('');
    } catch (e: any) { Alert.alert("Error", e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg}]}>
      <SharedHeader title="Manual Attendance" navigation={navigation} showBack theme={theme} />
      <View style={styles.scrollContent}>
        <Text style={[styles.inputLabel, {color: theme.textDark}]}>Faculty ID</Text>
        <TextInput style={[styles.inputField, {backgroundColor: theme.inputBg, color: theme.textDark}]} placeholder="Enter ID" placeholderTextColor={theme.textLight} value={facId} onChangeText={setFacId}/>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
           <TouchableOpacity onPress={() => setStatus('Present')} style={{padding: 15, flex: 0.48, alignItems: 'center', borderRadius: 12, backgroundColor: status === 'Present' ? '#4CAF50' : theme.inputBg}}><Text style={{color: status==='Present' ? '#FFF' : theme.textDark, fontWeight: 'bold'}}>Present</Text></TouchableOpacity>
           <TouchableOpacity onPress={() => setStatus('Absent')} style={{padding: 15, flex: 0.48, alignItems: 'center', borderRadius: 12, backgroundColor: status === 'Absent' ? '#FF6B6B' : theme.inputBg}}><Text style={{color: status==='Absent' ? '#FFF' : theme.textDark, fontWeight: 'bold'}}>Absent</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary}]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Submit Attendance</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- SETTINGS SCREEN ---
const SettingsScreen = ({ navigation }: any) => {
  const { theme, isDarkMode, toggleTheme } = useContext(AppContext);
  const rootNav = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => rootNav.reset({ index: 0, routes: [{ name: 'Login' }] }) }
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg}]}>
      <SharedHeader title="Settings" navigation={navigation} theme={theme} />
      <View style={styles.scrollContent}>
        <View style={[styles.settingItem, {backgroundColor: theme.surface}]}>
          <Text style={[styles.settingText, {color: theme.textDark}]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{true: theme.primary}} />
        </View>
        <TouchableOpacity style={[styles.settingItem, {backgroundColor: '#FF6B6B', marginTop: 30}]} onPress={handleLogout}>
          <Text style={[styles.settingText, {color: '#FFF'}]}>Log Out</Text>
          <LogOut color="#FFF" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- ADMIN PROFILE SCREEN ---
const AdminProfileScreen = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.bg}]}>
      <SharedHeader title="Admin Profile" navigation={navigation} theme={theme} />
      <View style={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarLarge, {backgroundColor: theme.primary}]} />
          <Text style={[styles.profileName, {color: theme.textDark}]}>System Admin</Text>
          <Text style={{color: theme.textLight}}>Master Access Level</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- NAVIGATION ---
const CustomTabBar = ({ state, navigation }: any) => {
  const { theme } = useContext(AppContext);
  const currentRoute = state.routes[state.index].name;
  return (
    <View style={styles.bottomNavWrapper}>
      <View style={[styles.bottomNav, {backgroundColor: theme.primary}]}>
        <TouchableOpacity onPress={() => navigation.navigate('FacultyAttendanceApproval')}><Calendar color={theme.white} size={24} opacity={currentRoute === 'FacultyAttendanceApproval' ? 1 : 0.7} /></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SubjectEntry')}><BookOpen color={theme.white} size={24} opacity={0.7} /></TouchableOpacity>
        <View style={[styles.fabOuter, {backgroundColor: theme.bg}]}><TouchableOpacity style={[styles.fabInner, {backgroundColor: theme.primary}]} onPress={() => navigation.navigate('AdminHome')}><HomeIcon color={theme.white} size={28} /></TouchableOpacity></View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Settings color={theme.white} size={24} opacity={currentRoute === 'Settings' ? 1 : 0.7} /></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}><User color={theme.white} size={24} opacity={currentRoute === 'AdminProfile' ? 1 : 0.7} /></TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminMasterClass() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <AppContext.Provider value={{ theme, isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode) }}>
        <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
          <Tab.Screen name="AdminHome" component={AdminDashboardScreen} />
          <Tab.Screen name="DepartmentEntry" component={DepartmentEntryScreen} />
          <Tab.Screen name="FacultyEntry" component={FacultyEntryScreen} />
          <Tab.Screen name="StudentEntry" component={StudentEntryScreen} />
          <Tab.Screen name="SubjectEntry" component={SubjectEntryScreen} />
          <Tab.Screen name="SubjectAllocation" component={SubjectAllocationScreen} />
          <Tab.Screen name="MarkFaculty" component={MarkFacultyScreen} />
          <Tab.Screen name="FacultyAttendanceApproval" component={FacultyAttendanceApprovalScreen} />
          <Tab.Screen name="TimetableManual" component={TimetableManualScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="AdminProfile" component={AdminProfileScreen} />
        </Tab.Navigator>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  topHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    height: 70,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 // <-- YEH LINE ADD KI HAI
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  tabBtn: { flex: 0.31, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, marginTop: 15 },
  dashboardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dashCard: { width: '48%', padding: 20, borderRadius: 24, marginBottom: 15, height: 120, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  dashCardTitle: { fontSize: 14, fontWeight: '700', marginTop: 10 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  inputField: { padding: 15, borderRadius: 12, fontSize: 15, marginBottom: 10 },
  actionBtn: { padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  manualCard: { padding: 15, borderRadius: 15, marginBottom: 15, elevation: 1 },
  bottomNavWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 75, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  fabOuter: { width: 70, height: 70, borderRadius: 35, marginTop: -40, justifyContent: 'center', alignItems: 'center' },
  fabInner: { width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 15, marginTop: 20 },
  settingText: { fontSize: 16, fontWeight: '600' },
  profileHeader: { alignItems: 'center', marginTop: 40 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50 },
  profileName: { fontSize: 22, fontWeight: '700', marginTop: 15 },
  daySelector: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  dayButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 10 
  }
});