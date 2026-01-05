import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

const StudentHomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      {/* Main Cards */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.mainCardText}>Time Table</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mainCard}>
        <Text style={styles.mainCardText}>Attendance</Text>
      </TouchableOpacity>

      {/* Small Cards */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.smallText}>YouTube{"\n"}Playlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.smallText}>Study{"\n"}Materials</Text>
        </TouchableOpacity>
      </View>

      {/* 🔔 MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Chart :</Text>

            <View style={styles.chartBox} />

            <Text style={styles.modalTitle}>Percentage :</Text>

            <View style={styles.chartBox} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StudentHomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#d9e7f6',
    },
  
    header: {
      backgroundColor: '#7fb3ff',
      padding: 15,
    },
  
    headerText: {
      fontSize: 18,
      color: '#243B55',
    },
  
    mainCard: {
      backgroundColor: '#b9dcff',
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
    },
  
    mainCardText: {
      fontSize: 20,
      color: '#2c5f9e',
      textDecorationLine: 'underline',
    },
  
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: 15,
    },
  
    smallCard: {
      backgroundColor: '#b9dcff',
      borderRadius: 18,
      padding: 20,
      width: '45%',
      alignItems: 'center',
    },
  
    smallText: {
      textAlign: 'center',
      color: '#2c5f9e',
    },
  
    /* MODAL */
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    modalCard: {
      backgroundColor: '#7fb3ff',
      borderRadius: 25,
      padding: 20,
      width: '85%',
    },
  
    modalTitle: {
      color: '#243B55',
      fontSize: 16,
      marginBottom: 8,
    },
  
    chartBox: {
      backgroundColor: '#d9e7f6',
      height: 120,
      borderRadius: 15,
      marginBottom: 15,
    },
  
    closeButton: {
      backgroundColor: '#337ac6',
      padding: 12,
      borderRadius: 15,
      alignItems: 'center',
    },
  
    closeText: {
      color: 'white',
      fontSize: 16,
    },
  });
  